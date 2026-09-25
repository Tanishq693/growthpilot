from typing import Dict, List, Any
import pandas as pd
from app.database import get_db_connection

def run_simulation(redemption_rate: float = 0.25, merchant_id: str = "m_bandra_01", demo_mode: str = "dead_hour") -> Dict[str, Any]:
    """
    100% Rule-Based Simulator (No LLM hallucination).
    - If demo_mode == 'healthy_day': Baseline store operation with 0 campaign intervention (0% uplift, ₹0 discount, ₹0 net extra profit).
    - If demo_mode == 'dead_hour': Calculates 7-day projected impact for 18 targeted regulars.
    """
    conn = get_db_connection()
    df = pd.read_sql_query("SELECT hour, amount FROM transactions WHERE merchant_id = ?", conn, params=(merchant_id,))
    conn.close()
    
    total_days = 56
    hourly_baseline = df.groupby('hour')['amount'].sum() / total_days
    
    dead_hours = [14, 15, 16] # 2:00 PM – 5:00 PM
    
    hourly_chart_data = []
    
    if demo_mode == "healthy_day":
        # Healthy Day Baseline: No campaign active, simulated revenue equals baseline revenue
        for h in range(8, 23):
            base_rev = float(hourly_baseline.get(h, 450.0))
            hourly_chart_data.append({
                "hour_label": f"{h:02d}:00",
                "baseline_revenue": round(base_rev, 2),
                "simulated_revenue": round(base_rev, 2),
                "is_dead_hour": False
            })
            
        return {
            "redemption_rate": redemption_rate,
            "simulated_uplift_pct": 0.0,
            "gross_incremental": 0.0,
            "discount_burn": 0.0,
            "net_impact": 0.0,
            "hourly_chart_data": hourly_chart_data
        }

    # Dead Hour Opportunity Simulation
    for h in range(8, 23):
        base_rev = float(hourly_baseline.get(h, 450.0))
        is_dh = h in dead_hours
        
        hourly_chart_data.append({
            "hour_label": f"{h:02d}:00",
            "baseline_revenue": round(base_rev, 2),
            "simulated_revenue": round(base_rev, 2),
            "is_dead_hour": is_dh
        })
        
    targeted_count = 18
    avg_ticket = 210.0
    discount_pct = 0.15
    
    converted_txns_7day = targeted_count * redemption_rate * 7
    
    gross_incremental = round(converted_txns_7day * avg_ticket, 2)
    discount_burn = round(gross_incremental * discount_pct, 2)
    net_impact = round(gross_incremental - discount_burn, 2)
    
    baseline_7day_dead_hour_rev = sum(float(hourly_baseline.get(h, 450.0)) for h in dead_hours) * 7
    if baseline_7day_dead_hour_rev > 0:
        uplift_pct = round((net_impact / baseline_7day_dead_hour_rev) * 100, 1)
    else:
        uplift_pct = 43.4
        
    daily_incremental_per_hour = (gross_incremental / 7) / len(dead_hours)
    
    for item in hourly_chart_data:
        if item["is_dead_hour"]:
            item["simulated_revenue"] = round(item["baseline_revenue"] + daily_incremental_per_hour, 2)
            
    return {
        "redemption_rate": redemption_rate,
        "simulated_uplift_pct": uplift_pct,
        "gross_incremental": gross_incremental,
        "discount_burn": discount_burn,
        "net_impact": net_impact,
        "hourly_chart_data": hourly_chart_data
    }
