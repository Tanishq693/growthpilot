import datetime
import hashlib
from typing import Dict, List, Any
from app.execution.base import BaseExecutor
from app.database import get_db_connection

def generate_paytm_qr_svg(short_id: str) -> str:
    """Generates a clean, modern SVG QR code graphic with Paytm signature style."""
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="160" height="160" class="mx-auto drop-shadow-sm rounded-lg border border-slate-200 bg-white p-2">
  <rect width="200" height="200" fill="#FFFFFF"/>
  <!-- Paytm Header Accent -->
  <rect x="10" y="10" width="180" height="24" rx="4" fill="#002970"/>
  <text x="100" y="26" fill="#00BAF2" font-family="sans-serif" font-weight="bold" font-size="12" text-anchor="middle">Paytm Accepted Here</text>
  
  <!-- Outer Position Detection Pattern (Top Left) -->
  <rect x="25" y="45" width="40" height="40" fill="#0A192F" rx="4"/>
  <rect x="30" y="50" width="30" height="30" fill="#FFFFFF" rx="2"/>
  <rect x="35" y="55" width="20" height="20" fill="#00BAF2" rx="2"/>
  
  <!-- Outer Position Detection Pattern (Top Right) -->
  <rect x="135" y="45" width="40" height="40" fill="#0A192F" rx="4"/>
  <rect x="140" y="50" width="30" height="30" fill="#FFFFFF" rx="2"/>
  <rect x="145" y="55" width="20" height="20" fill="#00BAF2" rx="2"/>

  <!-- Outer Position Detection Pattern (Bottom Left) -->
  <rect x="25" y="135" width="40" height="40" fill="#0A192F" rx="4"/>
  <rect x="30" y="140" width="30" height="30" fill="#FFFFFF" rx="2"/>
  <rect x="35" y="145" width="20" height="20" fill="#00BAF2" rx="2"/>

  <!-- Simulated QR Matrix Modules -->
  <rect x="75" y="50" width="12" height="12" fill="#0A192F" rx="1"/>
  <rect x="92" y="50" width="12" height="12" fill="#00BAF2" rx="1"/>
  <rect x="110" y="50" width="12" height="12" fill="#0A192F" rx="1"/>
  
  <rect x="75" y="68" width="12" height="12" fill="#00BAF2" rx="1"/>
  <rect x="92" y="68" width="12" height="12" fill="#0A192F" rx="1"/>
  <rect x="110" y="68" width="12" height="12" fill="#00BAF2" rx="1"/>

  <rect x="25" y="95" width="12" height="12" fill="#0A192F" rx="1"/>
  <rect x="42" y="95" width="12" height="12" fill="#00BAF2" rx="1"/>
  <rect x="60" y="95" width="12" height="12" fill="#0A192F" rx="1"/>
  <rect x="78" y="95" width="12" height="12" fill="#00BAF2" rx="1"/>
  <rect x="96" y="95" width="12" height="12" fill="#0A192F" rx="1"/>
  <rect x="114" y="95" width="12" height="12" fill="#00BAF2" rx="1"/>
  <rect x="132" y="95" width="12" height="12" fill="#0A192F" rx="1"/>
  <rect x="150" y="95" width="12" height="12" fill="#00BAF2" rx="1"/>

  <rect x="75" y="112" width="12" height="12" fill="#002970" rx="1"/>
  <rect x="92" y="112" width="12" height="12" fill="#0A192F" rx="1"/>
  <rect x="110" y="112" width="12" height="12" fill="#002970" rx="1"/>

  <rect x="135" y="112" width="12" height="12" fill="#0A192F" rx="1"/>
  <rect x="152" y="112" width="12" height="12" fill="#00BAF2" rx="1"/>

  <rect x="75" y="140" width="12" height="12" fill="#00BAF2" rx="1"/>
  <rect x="92" y="140" width="12" height="12" fill="#0A192F" rx="1"/>
  <rect x="110" y="140" width="12" height="12" fill="#00BAF2" rx="1"/>
  <rect x="135" y="140" width="12" height="12" fill="#0A192F" rx="1"/>
  <rect x="152" y="140" width="12" height="12" fill="#002970" rx="1"/>

  <!-- Footer Link Tag -->
  <text x="100" y="188" fill="#475569" font-family="sans-serif" font-size="9" text-anchor="middle">paytm.me/pay?id={short_id}</text>
</svg>'''

class MockExecutor(BaseExecutor):
    def execute_campaign(self, action_id: str, merchant_id: str, campaign_data: Dict) -> Dict:
        short_id = f"cp_dh_883"
        paytm_link = f"https://paytm.me/pay?id={short_id}"
        qr_svg = generate_paytm_qr_svg(short_id)
        
        dispatched_at = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        # Query 18 opted-in customers from SQLite DB to generate realistic customer dispatches
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
                "channel": "SMS & WhatsApp",
                "message_text": f"Chai & Snacks Special: Dopehar 2 se 5 baje paye 15% OFF! Pay via Paytm: {paytm_link}",
                "delivered_at": dispatched_at
            })
            
        return {
            "action_id": action_id,
            "status": "EXECUTED",
            "paytm_link": paytm_link,
            "qr_code_svg": qr_svg,
            "target_audience_count": len(dispatched_customers),
            "executor_type": "MockExecutor",
            "dispatched_at": dispatched_at,
            "dispatched_customers": dispatched_customers
        }
