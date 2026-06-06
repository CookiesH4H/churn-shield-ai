import duckdb from 'duckdb';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Customer from '../models/Customer';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Falta MONGODB_URI en .env.local");
  process.exit(1);
}

const db = new duckdb.Database(':memory:');
const con = db.connect();

async function run() {
  try {
    console.log("1. Conectando a MongoDB Atlas...");
    await mongoose.connect(MONGODB_URI!);
    console.log("✅ Conectado a MongoDB Atlas");

    console.log("2. Procesando datos con DuckDB (Leyendo CSVs)...");
    
    // Consulta SQL para combinar train y test, y unirlos con coolers y clientes
    const query = `
      WITH combined_sales AS (
          SELECT customer_id, calmonth, TRY_CAST(num_transacciones AS FLOAT) as num_transacciones, TRY_CAST(uni_boxes_sold_m AS FLOAT) as uni_boxes_sold_m, TRY_CAST(target AS INT) as target
          FROM read_csv_auto('data/sales_churn_train.csv')
          UNION ALL
          SELECT customer_id, calmonth, TRY_CAST(num_transacciones AS FLOAT) as num_transacciones, TRY_CAST(uni_boxes_sold_m AS FLOAT) as uni_boxes_sold_m, 0 as target
          FROM read_csv_auto('data/sales_churn_test.csv')
      ),
      coolers_cleaned AS (
          SELECT customer_id, calmonth, MAX(TRY_CAST(num_coolers AS INT)) as num_coolers, MAX(TRY_CAST(num_doors AS INT)) as num_doors
          FROM read_csv_auto('data/Coolers.csv')
          GROUP BY customer_id, calmonth
      ),
      monthly_data AS (
          SELECT 
              s.customer_id,
              s.calmonth,
              COALESCE(c.num_coolers, 0) as totalCoolers,
              COALESCE(c.num_doors, 0) as totalDoors,
              COALESCE(s.num_transacciones, 0) as totalTransactions,
              COALESCE(s.uni_boxes_sold_m, 0) as totalBoxesSold,
              COALESCE(s.target, 0) as target
          FROM combined_sales s
          LEFT JOIN coolers_cleaned c ON s.customer_id = c.customer_id AND s.calmonth = c.calmonth
      )
      SELECT 
          cli.customer_id as customerId,
          cli.territory_d as territory,
          cli.comercial_subchannel_d as subchannel,
          cli.rtm_customer_size_d as size,
          m.calmonth,
          m.totalCoolers,
          m.totalDoors,
          m.totalTransactions,
          m.totalBoxesSold,
          m.target
      FROM read_csv_auto('data/Clientes.csv') cli
      LEFT JOIN monthly_data m ON cli.customer_id = m.customer_id
      ORDER BY cli.customer_id, m.calmonth
    `;

    console.time("DuckDB Query");
    con.all(query, async (err, res) => {
      if (err) {
        console.error("Error en DuckDB:", err);
        return;
      }
      console.timeEnd("DuckDB Query");
      console.log(`✅ Procesamiento local listo. Total filas combinadas: ${res.length}`);
      
      console.log("3. Agrupando historial por cliente...");
      const customersMap = new Map();

      for (const row of res) {
        const id = row.customerId;
        if (!customersMap.has(id)) {
          customersMap.set(id, {
            customerId: id,
            territory: row.territory,
            subchannel: row.subchannel,
            size: row.size,
            history: [],
            churnRiskScore: Math.random() * 100 // Dummy score for dashboard initially
          });
        }
        
        const cust = customersMap.get(id);
        // Add monthly record if exists
        if (row.calmonth) {
          cust.history.push({
            calmonth: row.calmonth,
            totalCoolers: row.totalCoolers,
            totalDoors: row.totalDoors,
            totalTransactions: row.totalTransactions,
            totalBoxesSold: row.totalBoxesSold,
            target: row.target
          });
          
          // Overwrite risk score if we have a target=1 somewhere
          if (row.target === 1) {
             cust.churnRiskScore = Math.random() * 40 + 60; // High risk
          }
        }
      }

      const docsToInsert = Array.from(customersMap.values());
      console.log(`   Clientes únicos a insertar: ${docsToInsert.length}`);

      console.log("4. Vaciando colección antigua...");
      await Customer.deleteMany({});

      console.log("5. Subiendo clientes a MongoDB Atlas...");
      
      const chunkSize = 10000;
      for (let i = 0; i < docsToInsert.length; i += chunkSize) {
        const chunk = docsToInsert.slice(i, i + chunkSize);
        console.log(`   Insertando lote ${i} - ${i + chunk.length}...`);
        await Customer.insertMany(chunk);
      }

      console.log("✅ Datos subidos a MongoDB exitosamente.");
      process.exit(0);
    });

  } catch (error) {
    console.error("Error general:", error);
    process.exit(1);
  }
}

run();
