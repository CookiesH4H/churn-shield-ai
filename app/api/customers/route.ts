import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Customer from "@/models/Customer";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "30", 10);
    const search = searchParams.get("search") || "";
    const risk = searchParams.get("risk") || "All";
    const channel = searchParams.get("channel") || "All";
    const sortField = searchParams.get("sortField") || "churnRiskScore";
    const sortOrder = searchParams.get("sortOrder") || "desc"; // Sort high-risk first by default

    // Build the query object
    const query: any = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { customerId: { $regex: search, $options: "i" } }
      ];
    }
    
    if (risk && risk !== "All") {
      // Risk filter mapping since we map Spanish to English
      if (risk === "Low") query.$or = [{ riskLevel: "Low" }, { "ml_scoring.nivel_riesgo": "Bajo" }];
      else if (risk === "Medium") query.$or = [{ riskLevel: "Medium" }, { "ml_scoring.nivel_riesgo": "Medio" }];
      else if (risk === "High") query.$or = [{ riskLevel: "High" }, { "ml_scoring.nivel_riesgo": "Alto" }];
      else if (risk === "Critical") query.$or = [{ riskLevel: "Critical" }, { "ml_scoring.nivel_riesgo": "Crítico" }];
      else query.riskLevel = risk;
    }
    
    if (channel && channel !== "All") {
      if (channel === "Tradicional" || channel === "Canal Tradicional") {
        query.planTier = "Canal Tradicional";
      } else if (channel === "Moderno" || channel === "Canal Moderno") {
        query.planTier = "Canal Moderno";
      } else {
        query.planTier = channel;
      }
    }

    // Determine sorting
    let dbSortField = sortField;
    if (sortField === "churnRiskScore") {
      dbSortField = "ml_scoring.score_riesgo"; // sort by ML score
    }

    const sort: any = {};
    sort[dbSortField] = sortOrder === "asc" ? 1 : -1;
    // Add fallback sort
    if (sortField === "churnRiskScore") {
      sort["churnRiskScore"] = sortOrder === "asc" ? 1 : -1;
    }

    // Pipeline to fetch documents and join with ML results
    const pipeline: any[] = [
      {
        $lookup: {
          from: "scoring_results_marzo2026",
          localField: "customerId",
          foreignField: "customer_id",
          as: "ml_scoring"
        }
      },
      {
        $unwind: {
          path: "$ml_scoring"
        }
      },
      { $match: query }
    ];

    // Fetch total matching count for pagination metadata
    // We run a count on the same pipeline
    const countPipeline = [...pipeline, { $count: "total" }];
    const countResult = await Customer.aggregate(countPipeline);
    const totalCount = countResult.length > 0 ? countResult[0].total : 0;
    const totalPages = Math.ceil(totalCount / limit);

    // Fetch paginated customers
    const dataPipeline = [
      ...pipeline,
      { $sort: sort },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      {
        $project: {
          customerId: 1, name: 1, email: 1, planTier: 1, signupDate: 1, avatar: 1,
          lastLogin: 1, daysInactive: 1, sessionsLast30d: 1, coreFeatureUsage: 1,
          timeSpentWeekly: 1, mrr: 1, billingCycle: 1, paymentFailures: 1,
          openTickets: 1, npsScore: 1, churnRiskScore: 1, riskLevel: 1, primaryRiskFactor: 1,
          territory: 1, ml_scoring: 1
        }
      }
    ];

    const docs = await Customer.aggregate(dataPipeline);
    
    // Map the database fields to the frontend `Customer` interface
    const customers = docs.map((doc: any) => {
      const ml = doc.ml_scoring;

      const mapRiskLevel = (nivel: string) => {
        if (!nivel) return doc.riskLevel || "Low";
        switch(nivel.toLowerCase()) {
          case 'crítico': return 'Critical';
          case 'alto': return 'High';
          case 'medio': return 'Medium';
          case 'bajo': return 'Low';
          default: return doc.riskLevel || "Low";
        }
      };

      const regionMap: Record<string, string> = {
        "NUEVO LEON": "NLE",
        "GUADALAJARA": "GDL",
        "MONTERREY": "MTY",
        "CIUDAD DE MEXICO": "CDMX",
        "JALISCO": "JAL",
        "SINALOA": "SIN",
        "CHIHUAHUA": "CHH"
      };

      const rawTerritory = (doc.territory || "REG").toUpperCase();
      const territoryPrefix = regionMap[rawTerritory] || rawTerritory.substring(0, 3);
      const idSuffix = doc.customerId.substring(doc.customerId.length - 3);
      const displayId = `${territoryPrefix}${idSuffix}`;

      return {
        id: displayId,
        name: `Cliente ${displayId}`,
        email: doc.email || `contacto@${displayId.toLowerCase()}.com`,
        planTier: doc.planTier || "Canal Tradicional",
        signupDate: doc.signupDate || "2024-01-01",
        avatar: doc.avatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${doc.customerId}`,
        lastLogin: doc.lastLogin || "2024-05-01",
        daysInactive: doc.daysInactive || 0,
        sessionsLast30d: doc.sessionsLast30d || 10,
        coreFeatureUsage: doc.coreFeatureUsage || 50,
        timeSpentWeekly: doc.timeSpentWeekly || 60,
        mrr: doc.mrr || 49,
        billingCycle: doc.billingCycle || "Mensual",
        paymentFailures: doc.paymentFailures || 0,
        openTickets: doc.openTickets || 0,
        npsScore: doc.npsScore || 8,
        churnProbability: ml?.score_riesgo ?? (doc.churnRiskScore !== undefined ? Math.round(doc.churnRiskScore) : 10),
        riskLevel: mapRiskLevel(ml?.nivel_riesgo),
        primaryRiskFactor: ml?.primary_risk_factor ?? doc.primaryRiskFactor ?? "none",
        customerSize: ml?.rtm_customer_size_d ?? "Unknown",
        realId: ml?.customer_id ?? doc.customerId ?? "Desconocido",
        abandonmentReason: ml?.razon_abandono ?? "Sin razón registrada"
      };
    });

    // Perform database aggregation to compute overall risk stats for ChurnRiskOverview
    const statsPipeline = [
      {
        $lookup: {
          from: "scoring_results_marzo2026",
          localField: "customerId",
          foreignField: "customer_id",
          as: "ml_scoring"
        }
      },
      {
        $unwind: {
          path: "$ml_scoring"
        }
      },
      {
        $group: {
          _id: {
            $switch: {
              branches: [
                { case: { $eq: ["$ml_scoring.nivel_riesgo", "Bajo"] }, then: "low" },
                { case: { $eq: ["$ml_scoring.nivel_riesgo", "Medio"] }, then: "medium" },
                { case: { $eq: ["$ml_scoring.nivel_riesgo", "Alto"] }, then: "high" },
                { case: { $eq: ["$ml_scoring.nivel_riesgo", "Crítico"] }, then: "critical" }
              ],
              default: { $toLower: "$riskLevel" }
            }
          },
          count: { $sum: 1 }
        }
      }
    ];

    const aggregationResult = await Customer.aggregate(statsPipeline);

    // Map aggregation results to simple stats object
    const stats = { low: 0, medium: 0, high: 0, critical: 0 };
    aggregationResult.forEach((item: any) => {
      const level = item._id ? item._id.toLowerCase() : "low";
      if (level === "low") {
        stats.low += item.count;
      } else if (level === "medium") {
        stats.medium += item.count;
      } else if (level === "high") {
        stats.high += item.count;
      } else {
        stats.critical += item.count;
      }
    });

    // Fallback if database is empty
    if (stats.low === 0 && stats.medium === 0 && stats.high === 0 && stats.critical === 0) {
      stats.low = 3; // default values for mock display if empty
      stats.medium = 2;
      stats.high = 1;
      stats.critical = 1;
    }

    // Perform database aggregation to compute reasons for abandonment
    const reasonsPipeline = [
      {
        $lookup: {
          from: "scoring_results_marzo2026",
          localField: "customerId",
          foreignField: "customer_id",
          as: "ml_scoring"
        }
      },
      {
        $unwind: {
          path: "$ml_scoring"
        }
      },
      {
        $group: {
          _id: "$ml_scoring.razon_abandono",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ];

    const reasonsResult = await Customer.aggregate(reasonsPipeline);
    const reasonsStats = reasonsResult.map((r: any) => ({
      reason: r._id || "Desconocida",
      count: r.count
    }));

    return NextResponse.json({
      customers,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages
      },
      stats,
      reasonsStats
    });
  } catch (error) {
    console.error("Database connection failed", error);
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}

