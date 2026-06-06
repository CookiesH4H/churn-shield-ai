import duckdb from 'duckdb';

const db = new duckdb.Database(':memory:');
const con = db.connect();

console.log("Contando clientes...");

con.all("SELECT COUNT(DISTINCT customer_id) as total FROM read_csv_auto('data/Clientes.csv')", (err, res) => {
  console.log("Total Clientes.csv:", res?.[0]?.total);
  
  con.all("SELECT COUNT(DISTINCT customer_id) as total FROM read_csv_auto('data/sales_churn_train.csv')", (err2, res2) => {
    console.log("Total sales_churn_train.csv:", res2?.[0]?.total);
    
    con.all("SELECT COUNT(DISTINCT customer_id) as total FROM read_csv_auto('data/sales_churn_test.csv')", (err3, res3) => {
      console.log("Total sales_churn_test.csv:", res3?.[0]?.total);
      process.exit(0);
    });
  });
});
