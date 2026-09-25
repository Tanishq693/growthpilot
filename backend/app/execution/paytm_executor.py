import datetime
from app.execution.base import BaseExecutor
from app.execution.mock_executor import generate_paytm_qr_svg
from app.database import get_db_connection

class PaytmExecutor(BaseExecutor):
    """
    Paytm Staging API Executor representation.
    Emulates production link creation via Paytm Merchant Payment Gateway / Link Primitives.
    """
    def execute_campaign(self, action_id: str, merchant_id: str, campaign_data: dict) -> dict:
        short_id = f"paytm_stg_{action_id[-6:]}"
        paytm_link = f"https://paytm.me/pay?id={short_id}"
        qr_svg = generate_paytm_qr_svg(short_id)
        dispatched_at = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT name, phone_masked FROM customers WHERE merchant_id = ? AND opt_in_marketing = 1 LIMIT 18", (merchant_id,))
        rows = cursor.fetchall()
        conn.close()
        
        dispatched_customers = []
        for r in rows:
            dispatched_customers.append({
                "customer_name": r["name"],
                "phone_masked": r["phone_masked"],
                "status": "DELIVERED",
                "channel": "Paytm SMS Gateway",
                "message_text": f"Chai & Snacks Special: Dopehar 2 se 5 baje paye 15% OFF! Pay via Paytm: {paytm_link}",
                "delivered_at": dispatched_at
            })
        
        return {
            "action_id": action_id,
            "status": "EXECUTED_STAGING_API",
            "paytm_link": paytm_link,
            "qr_code_svg": qr_svg,
            "target_audience_count": len(dispatched_customers),
            "executor_type": "PaytmStagingAPI",
            "dispatched_at": dispatched_at,
            "dispatched_customers": dispatched_customers
        }
