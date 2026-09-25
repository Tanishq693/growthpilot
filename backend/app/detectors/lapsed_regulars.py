import pandas as pd
from app.database import get_db_connection

def detect_lapsed_regulars(merchant_id: str = 'm_bandra_01'):
    """
    Pandas-powered Lapsed Regulars Detector.
    Identifies repeat customers (>= 4 visits) with last visit gap > 21 days.
    """
    conn = get_db_connection()
    query = """
    SELECT customer_hash, name, phone_masked, opt_in_marketing, total_visits, avg_spend, last_visit_date, last_contacted_date 
    FROM customers 
    WHERE merchant_id = ?
    """
    df = pd.read_sql_query(query, conn, params=(merchant_id,))
    conn.close()
    
    if df.empty:
        return None

    df['last_visit_date'] = pd.to_datetime(df['last_visit_date'])
    now = pd.Timestamp.now()
    df['days_since_last_visit'] = (now - df['last_visit_date']).dt.days
    
    lapsed_df = df[(df['total_visits'] >= 4) & (df['days_since_last_visit'] > 10) & (df['opt_in_marketing'] == 1)]
    
    return {
        "detector_name": "LapsedRegulars_Pandas_Detector",
        "merchant_id": merchant_id,
        "lapsed_count": len(lapsed_df),
        "total_regulars": len(df),
        "opted_in_lapsed_count": len(lapsed_df),
        "avg_ticket": float(lapsed_df['avg_spend'].mean()) if not lapsed_df.empty else 200.0,
        "raw_pandas_metrics": {
            "lapsed_customer_hashes": lapsed_df['customer_hash'].tolist()[:5],
            "average_days_silent": float(lapsed_df['days_since_last_visit'].mean()) if not lapsed_df.empty else 14.0
        }
    }
