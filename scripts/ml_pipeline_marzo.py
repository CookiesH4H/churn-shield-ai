import pandas as pd
import numpy as np
import os
import time
from pymongo import MongoClient
from xgboost import XGBClassifier
from sklearn.metrics import roc_auc_score

# Configuración del URI de MongoDB Atlas y carpeta local
uri = "mongodb+srv://ACH4H:admin@ac.58wdoi8.mongodb.net/churn_db"
folder = r"C:\Users\melan\.gemini\antigravity\scratch"
t_start = time.time()

print("================================================================================")
print("INICIANDO MODELO DE SCORING CON SUBIDA INTEGRADA A MONGODB")
print("================================================================================")

# -------------------------------------------------------------
# Paso 1: Conexión y Descarga de Datos desde MongoDB
# -------------------------------------------------------------
print("\nPaso 1: Conectando a MongoDB Atlas...")
try:
    client = MongoClient(uri)
    db = client.churn_db
    customers_col = db.customers
    
    print("Descargando documentos de la colección 'customers'...")
    docs = list(customers_col.find())
    print(f"Descargados {len(docs)} documentos de clientes.")
    
except Exception as e:
    print(f"Error conectando o descargando de MongoDB: {e}")
    exit(1)

# Reconstruir DataFrames a partir del esquema NoSQL anidado
print("Desempaquetando estructura de documentos NoSQL...")
clientes_list = []
coolers_list = []
sales_list = []

for doc in docs:
    cid = doc['customerId']
    territory = doc.get('territory', 'Unknown')
    subchannel = doc.get('subchannel', 'Unknown')
    size = doc.get('size', 'Unknown')
    
    territory = 'Unknown' if pd.isna(territory) else territory
    subchannel = 'Unknown' if pd.isna(subchannel) else subchannel
    size = 'Unknown' if pd.isna(size) else size
    
    clientes_list.append({
        'customer_id': cid,
        'territory_d': territory,
        'comercial_subchannel_d': subchannel,
        'rtm_customer_size_d': size
    })
    
    history = doc.get('history', [])
    for hist in history:
        calmonth_str = hist.get('calmonth')
        if not calmonth_str:
            continue
        calmonth = int(calmonth_str)
        
        coolers_list.append({
            'customer_id': cid,
            'calmonth': calmonth,
            'num_coolers': float(hist.get('totalCoolers', 0)),
            'num_doors': int(hist.get('totalDoors', 0))
        })
        
        sales_list.append({
            'customer_id': cid,
            'calmonth': calmonth,
            'num_transacciones': int(hist.get('totalTransactions', 0)),
            'uni_boxes_sold_m': float(hist.get('totalBoxesSold', 0)),
            'target': int(hist.get('target', 0))
        })

clientes = pd.DataFrame(clientes_list)
coolers = pd.DataFrame(coolers_list)
sales = pd.DataFrame(sales_list)

# Separar transacciones en entrenamiento (hasta Enero 2026) y test (Febrero 2026)
train_sales = sales[sales['calmonth'] <= 202601].copy()
test_sales = sales[sales['calmonth'] == 202602].copy()

# Mapear fechas a índices continuos
def to_month_idx(calmonth):
    year = calmonth // 100
    month = calmonth % 100
    return (year - 2024) * 12 + (month - 1)

train_sales['month_idx'] = to_month_idx(train_sales['calmonth'])
test_sales['month_idx'] = to_month_idx(test_sales['calmonth'])
coolers['month_idx'] = to_month_idx(coolers['calmonth'])

combined_sales = pd.concat([
    train_sales[['customer_id', 'month_idx', 'num_transacciones', 'uni_boxes_sold_m']],
    test_sales[['customer_id', 'month_idx', 'num_transacciones', 'uni_boxes_sold_m']]
], ignore_index=True)

clientes_orig = clientes.copy()

# Codificar categorías para XGBoost
for col in ['territory_d', 'comercial_subchannel_d', 'rtm_customer_size_d']:
    clientes[col] = clientes[col].astype('category').cat.codes

print(f"Tablas listas. Ventas entrenamiento: {len(train_sales)}. Ventas predicción: {len(test_sales)}.")

# -------------------------------------------------------------
# Paso 2: Función para Construir las Variables (Feature Engineering)
# -------------------------------------------------------------
def prepare_cut(M, is_prediction=False):
    if is_prediction:
        C_active = test_sales[test_sales['month_idx'] == M]['customer_id'].unique()
    else:
        C_active = train_sales[(train_sales['month_idx'] == M) & (train_sales['target'] == 0)]['customer_id'].unique()
    
    sales_slice = combined_sales[(combined_sales['month_idx'].between(M-5, M)) & (combined_sales['customer_id'].isin(C_active))]
    coolers_slice = coolers[(coolers['month_idx'].between(M-2, M)) & (coolers['customer_id'].isin(C_active))]
    
    # Métricas agregadas de compras en los últimos 3 meses
    sales_3m = sales_slice[sales_slice['month_idx'].between(M-2, M)]
    sales_agg = sales_3m.groupby('customer_id').agg(
        sum_trans=('num_transacciones', 'sum'),
        mean_trans=('num_transacciones', 'mean'),
        std_trans=('num_transacciones', 'std'),
        sum_boxes=('uni_boxes_sold_m', 'sum'),
        mean_boxes=('uni_boxes_sold_m', 'mean'),
        std_boxes=('uni_boxes_sold_m', 'std')
    ).reset_index()
    
    sales_curr = sales_slice[sales_slice['month_idx'] == M][['customer_id', 'num_transacciones', 'uni_boxes_sold_m']].rename(
        columns={'num_transacciones': 'curr_trans', 'uni_boxes_sold_m': 'curr_boxes'}
    )
    
    # Ventas en ventana previa (M-3 a M-5) para medir tendencia
    sales_trend_window = sales_slice[sales_slice['month_idx'].between(M-5, M-3)]
    trend_agg = sales_trend_window.groupby('customer_id').agg(
        trend_sum_trans=('num_transacciones', 'sum'),
        trend_sum_boxes=('uni_boxes_sold_m', 'sum')
    ).reset_index()
    
    features = pd.DataFrame({'customer_id': C_active})
    features = pd.merge(features, sales_agg, on='customer_id', how='left')
    features = pd.merge(features, sales_curr, on='customer_id', how='left')
    features = pd.merge(features, trend_agg, on='customer_id', how='left')
    
    for col in ['sum_trans', 'mean_trans', 'std_trans', 'sum_boxes', 'mean_boxes', 'std_boxes', 
                'curr_trans', 'curr_boxes', 'trend_sum_trans', 'trend_sum_boxes']:
        features[col] = features[col].fillna(0)
        
    features['ratio_trans_trend'] = features['sum_trans'] / (features['trend_sum_trans'] + 0.001)
    features['ratio_boxes_trend'] = features['sum_boxes'] / (features['trend_sum_boxes'] + 0.001)
    features['recency_active'] = (features['curr_trans'] > 0).astype(int)
    
    # Capacidad física de frío (Coolers)
    coolers_agg = coolers_slice.groupby('customer_id').agg(
        max_coolers=('num_coolers', 'max'),
        mean_coolers=('num_coolers', 'mean'),
        max_doors=('num_doors', 'max'),
        mean_doors=('num_doors', 'mean')
    ).reset_index()
    
    coolers_curr = coolers_slice[coolers_slice['month_idx'] == M][['customer_id', 'num_coolers']].rename(columns={'num_coolers': 'curr_coolers'})
    coolers_prev2 = coolers_slice[coolers_slice['month_idx'] == M-2][['customer_id', 'num_coolers']].rename(columns={'num_coolers': 'prev2_coolers'})
    
    features = pd.merge(features, coolers_agg, on='customer_id', how='left')
    features = pd.merge(features, coolers_curr, on='customer_id', how='left')
    features = pd.merge(features, coolers_prev2, on='customer_id', how='left')
    
    for col in ['max_coolers', 'mean_coolers', 'max_doors', 'mean_doors', 'curr_coolers', 'prev2_coolers']:
        features[col] = features[col].fillna(0)
        
    features['var_coolers_3m'] = features['curr_coolers'] - features['prev2_coolers']
    features = pd.merge(features, clientes, on='customer_id', how='left')
    
    # Calcular las tasas de abandono promedio por subcanal, tamaño y región
    train_slice = train_sales[train_sales['month_idx'].between(M-2, M)]
    train_slice_profile = pd.merge(train_slice[['customer_id', 'target']], clientes, on='customer_id', how='left')
    
    reg_rates = train_slice_profile.groupby('territory_d')['target'].agg(['sum', 'count'])
    reg_rates['tasa_churn_region'] = reg_rates['sum'] / (reg_rates['count'] + 0.001)
    features = pd.merge(features, reg_rates[['tasa_churn_region']], on='territory_d', how='left')
    
    sub_rates = train_slice_profile.groupby('comercial_subchannel_d')['target'].agg(['sum', 'count'])
    sub_rates['tasa_churn_subcanal'] = sub_rates['sum'] / (sub_rates['count'] + 0.001)
    features = pd.merge(features, sub_rates[['tasa_churn_subcanal']], on='comercial_subchannel_d', how='left')
    
    size_rates = train_slice_profile.groupby('rtm_customer_size_d')['target'].agg(['sum', 'count'])
    size_rates['tasa_churn_tamano'] = size_rates['sum'] / (size_rates['count'] + 0.001)
    features = pd.merge(features, size_rates[['tasa_churn_tamano']], on='rtm_customer_size_d', how='left')
    
    reg_size_rates = train_slice_profile.groupby(['territory_d', 'rtm_customer_size_d'])['target'].agg(['sum', 'count'])
    reg_size_rates['tasa_churn_region_tamano'] = reg_size_rates['sum'] / (reg_size_rates['count'] + 0.001)
    features = pd.merge(features, reg_size_rates[['tasa_churn_region_tamano']], on=['territory_d', 'rtm_customer_size_d'], how='left')
    
    for col in ['tasa_churn_region', 'tasa_churn_subcanal', 'tasa_churn_tamano', 'tasa_churn_region_tamano']:
        features[col] = features[col].fillna(0.008)
        
    if not is_prediction:
        # Horizonte mensual: Churn en el mes M+1
        churners = set(train_sales[(train_sales['month_idx'] == M+1) & (train_sales['target'] == 1)]['customer_id'])
        features['target'] = features['customer_id'].apply(lambda x: 1 if x in churners else 0)
        
    return features

# -------------------------------------------------------------
# Paso 3: Generar Cortes de Entrenamiento y Validación
# -------------------------------------------------------------
print("\nPaso 2: Generando cortes temporales de entrenamiento...")
# Cortes mensuales para entrenamiento
train_cuts = [6, 9, 12, 15, 18, 20, 22]
train_dfs = [prepare_cut(M, is_prediction=False) for M in train_cuts]
df_train = pd.concat(train_dfs, ignore_index=True)

# Validación mensual (Diciembre 2025 predice abandono en Enero 2026)
df_val = prepare_cut(23, is_prediction=False)

# -------------------------------------------------------------
# Paso 4: Entrenamiento del Modelo XGBoost
# -------------------------------------------------------------
print("\nPaso 3: Entrenando el modelo XGBoost...")
features_cols = [
    'sum_trans', 'mean_trans', 'std_trans', 'sum_boxes', 'mean_boxes', 'std_boxes',
    'curr_trans', 'curr_boxes', 'ratio_trans_trend', 'ratio_boxes_trend', 'recency_active',
    'max_coolers', 'mean_coolers', 'max_doors', 'mean_doors', 'curr_coolers', 'var_coolers_3m',
    'territory_d', 'comercial_subchannel_d', 'rtm_customer_size_d',
    'tasa_churn_region', 'tasa_churn_subcanal', 'tasa_churn_tamano', 'tasa_churn_region_tamano'
]

X_train = df_train[features_cols]
y_train = df_train['target']
X_val = df_val[features_cols]
y_val = df_val['target']

scale_pos_weight = (len(y_train) - y_train.sum()) / y_train.sum()

model = XGBClassifier(
    n_estimators=150,
    max_depth=6,
    learning_rate=0.1,
    scale_pos_weight=scale_pos_weight,
    random_state=42,
    n_jobs=-1,
    tree_method='hist'
)
model.fit(X_train, y_train, eval_set=[(X_val, y_val)], verbose=30)

y_pred_prob = model.predict_proba(X_val)[:, 1]
print(f"ROC-AUC de Validación Temporal (Diciembre 2025): {roc_auc_score(y_val, y_pred_prob):.4f}")

# -------------------------------------------------------------
# Paso 5: Predicción de Churn para Marzo 2026
# -------------------------------------------------------------
print("\nPaso 4: Calculando proyecciones de abandono para Marzo 2026...")
df_pred = prepare_cut(25, is_prediction=True)
X_pred = df_pred[features_cols]

probs = model.predict_proba(X_pred)[:, 1]
df_pred['probabilidad_abandono'] = probs
df_pred['score_riesgo'] = np.round(probs * 100).astype(int)

df_pred['nivel_riesgo'] = df_pred['score_riesgo'].apply(
    lambda s: 'Crítico' if s >= 80 else ('Alto' if s >= 60 else ('Medio' if s >= 30 else 'Bajo'))
)

df_pred['decil_riesgo'] = pd.qcut(df_pred['probabilidad_abandono'].rank(method='first'), 10, labels=False) + 1

df_pred_clean = df_pred.drop(columns=['rtm_customer_size_d'])
df_final = pd.merge(df_pred_clean, clientes_orig[['customer_id', 'rtm_customer_size_d']], on='customer_id', how='left')

# Reglas del Escenario C
def get_accion_comercial(row):
    size = row['rtm_customer_size_d']
    score = row['score_riesgo']
    
    if size in ['Grande', 'Gigante']:
        return 'Accion Inmediata VIP (Visita Gerente + Beneficio Cooler)' if score >= 30 else 'Mantener Operacion Regular'
    elif size == 'Mediano':
        if score >= 60:
            return 'Accion Inmediata VIP (Visita Gerente + Beneficio Cooler)'
        elif score >= 30:
            return 'Visita Preventiva del Vendedor'
        else:
            return 'Mantener Operacion Regular'
    else:
        if score >= 80:
            return 'Visita Preventiva del Vendedor'
        elif score >= 30:
            return 'Contacto Digital (Llamada Call Center + Cuponera en App)'
        else:
            return 'Mantener Operacion Regular'

df_final['accion_comercial'] = df_final.apply(get_accion_comercial, axis=1)
df_final = df_final.drop_duplicates(subset=['customer_id'])

# Diagnóstico de la razón principal de abandono (XAI)
def explain_churn(row):
    score = row['score_riesgo']
    
    if score < 30:
        return 'none', 'Sin factores de riesgo activos'
        
    # 1. Retiro de cooler o pérdida de capacidad (prioridad alta)
    if row['var_coolers_3m'] < 0 or (row['curr_coolers'] == 0 and row['prev2_coolers'] > 0):
        return 'payment_failures', 'Disminución de capacidad / Retiro de cooler'
        
    # 2. Caída drástica en compras (transacciones o volumen)
    if row['ratio_trans_trend'] < 0.6 or row['ratio_boxes_trend'] < 0.6 or row['recency_active'] == 0:
        return 'low_usage', 'Tendencia de caída en compras (Canal masivo)'
        
    # 3. Factores demográficos/geográficos de zona de alto abandono
    if row['tasa_churn_region_tamano'] > 0.05 or row['tasa_churn_region'] > 0.03:
        return 'support_tickets', 'Riesgo extremo en zona de alto abandono'
        
    # 4. Caída moderada de compras
    if row['ratio_trans_trend'] < 0.85 or row['ratio_boxes_trend'] < 0.85:
        return 'low_usage', 'Tendencia de caída en compras (Canal masivo)'
        
    return 'support_tickets', 'Riesgo extremo en zona de alto abandono'

df_final['explicacion_res'] = df_final.apply(explain_churn, axis=1)
df_final['primary_risk_factor'] = df_final['explicacion_res'].apply(lambda x: x[0])
df_final['razon_abandono'] = df_final['explicacion_res'].apply(lambda x: x[1])
df_final = df_final.drop(columns=['explicacion_res'])

# -------------------------------------------------------------
# Paso 6: Guardar Resultados en un Archivo CSV Local
# -------------------------------------------------------------
print("\nPaso 5: Guardando resultados locales en CSV...")
output_cols = ['customer_id', 'rtm_customer_size_d', 'probabilidad_abandono', 'score_riesgo', 'nivel_riesgo', 'decil_riesgo', 'accion_comercial', 'primary_risk_factor', 'razon_abandono']
final_csv = df_final[output_cols]

output_path = os.path.join(folder, "scoring_clientes_marzo2026.csv")
try:
    # Ensure the folder exists
    os.makedirs(folder, exist_ok=True)
    final_csv.to_csv(output_path, index=False)
    print(f"¡Éxito! Archivo CSV guardado en: {output_path}")
except PermissionError:
    alt_path = os.path.join(folder, "scoring_clientes_marzo2026_backup.csv")
    try:
        final_csv.to_csv(alt_path, index=False)
        print(f"Advertencia: El archivo principal estaba bloqueado. Respaldo guardado en: {alt_path}")
    except Exception as e:
        print(f"No se pudo guardar la copia local: {e}")
except Exception as e:
    print(f"Error general guardando csv: {e}")

# -------------------------------------------------------------
# Paso 7: Subir Resultados a MongoDB Atlas (Nuevo Paso Integrado)
# -------------------------------------------------------------
print("\nPaso 6: Subiendo resultados a la colección 'scoring_results_marzo2026' en MongoDB Atlas...")
try:
    col_name = "scoring_results_marzo2026"
    results_col = db[col_name]
    
    print(f"Limpiando registros antiguos de la colección '{col_name}'...")
    results_col.delete_many({})
    
    # Convertir registros de Pandas a JSON/Diccionarios
    records = final_csv.to_dict(orient='records')
    
    print(f"Subiendo {len(records)} registros en lote...")
    if records:
        result = results_col.insert_many(records)
        print(f"¡Éxito! Se subieron {len(result.inserted_ids)} registros a MongoDB Atlas.")
    else:
        print("No se encontraron registros para subir.")
        
except Exception as e:
    print(f"Error al subir los resultados a MongoDB Atlas: {e}")

print("\n================================================================================")
print("PROCESO TERMINADO CON ÉXITO")
print(f"Tiempo total: {time.time() - t_start:.2f} segundos.")
print("================================================================================")
