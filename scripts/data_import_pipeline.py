import random
import datetime
from pymongo import MongoClient, UpdateOne

URI = "mongodb+srv://ACH4H:admin@ac.58wdoi8.mongodb.net/churn_db"

def generate_mock_name(cid):
    names = ["Tienda La Estrella", "Supermercado El Sol", "Abarrotes Don Pepe", "Minisuper Express", "Kiosko Central"]
    return f"{random.choice(names)} {cid[-4:]}"

def generate_mock_email(name):
    clean_name = name.lower().replace(" ", "").replace("ñ", "n")
    domains = ["gmail.com", "hotmail.com", "outlook.com", "yahoo.com"]
    return f"contacto_{clean_name}@{random.choice(domains)}"

def run_pipeline():
    print("================================================================================")
    print("INICIANDO PIPELINE DE IMPORTACIÓN Y CLASIFICACIÓN DE DATOS")
    print("================================================================================")
    
    try:
        client = MongoClient(URI)
        db = client.churn_db
        customers_col = db.customers
        
        docs = list(customers_col.find())
        print(f"Descargados {len(docs)} registros de clientes desde MongoDB Atlas.")
        
        bulk_operations = []
        
        for doc in docs:
            cid = doc.get("customerId", str(random.randint(10000, 99999)))
            
            # Extract basic data
            territory = doc.get('territory', 'Unknown')
            subchannel = doc.get('subchannel', 'Unknown')
            size = doc.get('size', 'Unknown')
            
            # Map size to planTier (Clasificación de negocio a "Planes" de la plataforma)
            plan_tier = "Canal Moderno" if size in ["Grande", "Gigante"] else "Canal Tradicional"
            
            # Simulate usage and interaction metrics based on recent sales
            history = doc.get('history', [])
            total_transactions = sum(int(h.get('totalTransactions', 0)) for h in history[-3:]) # Last 3 months
            
            if total_transactions == 0:
                days_inactive = random.randint(14, 60)
                sessions_30d = random.randint(0, 2)
                core_usage = random.randint(5, 30)
            elif total_transactions < 10:
                days_inactive = random.randint(5, 13)
                sessions_30d = random.randint(3, 10)
                core_usage = random.randint(30, 60)
            else:
                days_inactive = random.randint(0, 4)
                sessions_30d = random.randint(15, 40)
                core_usage = random.randint(65, 98)
                
            time_spent_weekly = sessions_30d * random.randint(5, 15)
            
            # Financial metrics
            mrr = 199.00 if plan_tier == "Canal Moderno" else 49.00
            payment_failures = 1 if "payment_failures" in doc.get("primaryRiskFactor", "") else 0
            
            # Support metrics
            open_tickets = random.randint(1, 4) if "support_tickets" in doc.get("primaryRiskFactor", "") else random.randint(0, 1)
            
            # Generate missing UI fields
            name = generate_mock_name(cid)
            email = generate_mock_email(name)
            avatar = f"https://api.dicebear.com/7.x/notionists/svg?seed={cid}"
            
            # Prepare update document for the platform
            update_fields = {
                'name': name,
                'email': email,
                'planTier': plan_tier,
                'signupDate': (datetime.date.today() - datetime.timedelta(days=random.randint(100, 1000))).isoformat(),
                'avatar': avatar,
                'lastLogin': (datetime.date.today() - datetime.timedelta(days=days_inactive)).isoformat(),
                'daysInactive': days_inactive,
                'sessionsLast30d': sessions_30d,
                'coreFeatureUsage': core_usage,
                'timeSpentWeekly': time_spent_weekly,
                'mrr': mrr,
                'billingCycle': 'Mensual',
                'paymentFailures': payment_failures,
                'openTickets': open_tickets,
                'npsScore': random.randint(5, 10) if days_inactive < 10 else random.randint(1, 6)
            }
            
            bulk_operations.append(
                UpdateOne(
                    {'_id': doc['_id']},
                    {'$set': update_fields}
                )
            )
            
        if bulk_operations:
            result = customers_col.bulk_write(bulk_operations)
            print(f"Éxito: Se acomodaron {result.modified_count} perfiles en la plataforma de MongoDB.")
            
    except Exception as e:
        print(f"Error en el pipeline de importación: {e}")

if __name__ == "__main__":
    run_pipeline()
