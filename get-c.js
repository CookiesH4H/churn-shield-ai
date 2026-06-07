const mongoose = require('mongoose');

async function run() {
  await mongoose.connect('mongodb+srv://ACH4H:admin@ac.58wdoi8.mongodb.net/churn_db');
  const db = mongoose.connection.db;
  
  const cust = await db.collection('customers').findOne({});
  const score = await db.collection('scoring_results_marzo2026').findOne({});
  
  console.log("--- DATOS ORIGINALES ---");
  console.log(JSON.stringify(cust, null, 2));
  console.log("\n--- RESULTADO DEL MODELO (SCORE) ---");
  console.log(JSON.stringify(score, null, 2));
  
  await mongoose.disconnect();
}

run().catch(console.error);
