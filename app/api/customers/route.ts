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
      query.riskLevel = risk;
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
    const sort: any = {};
    sort[sortField] = sortOrder === "asc" ? 1 : -1;

    // Fetch total matching count for pagination metadata
    const totalCount = await Customer.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    // Fetch paginated customers from MongoDB with projection to avoid downloading heavy history arrays
    const docs = await Customer.find(query, {
      customerId: 1, name: 1, email: 1, planTier: 1, signupDate: 1, avatar: 1,
      lastLogin: 1, daysInactive: 1, sessionsLast30d: 1, coreFeatureUsage: 1,
      timeSpentWeekly: 1, mrr: 1, billingCycle: 1, paymentFailures: 1,
      openTickets: 1, npsScore: 1, churnRiskScore: 1, riskLevel: 1, primaryRiskFactor: 1
    })
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();
    
    // Map the database fields to the frontend `Customer` interface
    const customers = docs.map((doc: any) => ({
      id: doc.customerId,
      name: doc.name || `User ${doc.customerId.substring(0, 4)}`,
      email: doc.email || `user${doc.customerId}@example.com`,
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
      churnProbability: doc.churnRiskScore !== undefined ? Math.round(doc.churnRiskScore) : 10,
      riskLevel: doc.riskLevel || "Low",
      primaryRiskFactor: doc.primaryRiskFactor || "none"
    }));

    // Perform database aggregation to compute overall risk stats for ChurnRiskOverview
    const aggregationResult = await Customer.aggregate([
      {
        $group: {
          _id: "$riskLevel",
          count: { $sum: 1 }
        }
      }
    ]);

    // Map aggregation results to simple stats object
    const stats = { low: 0, medium: 0, high: 0 };
    aggregationResult.forEach((item: any) => {
      const level = item._id ? item._id.toLowerCase() : "low";
      if (level === "low") {
        stats.low += item.count;
      } else if (level === "medium") {
        stats.medium += item.count;
      } else {
        // High, Critical, or others default to high risk
        stats.high += item.count;
      }
    });

    // Fallback if database is empty
    if (stats.low === 0 && stats.medium === 0 && stats.high === 0) {
      stats.low = 3; // default values for mock display if empty
      stats.medium = 2;
      stats.high = 1;
    }

    return NextResponse.json({
      customers,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages
      },
      stats
    });
  } catch (error) {
    console.error("Database connection failed", error);
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}
