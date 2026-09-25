import sqlite3
import os
import random
from datetime import datetime, timedelta

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "growthpilot.db")

def get_db_connection():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Table: merchants
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS merchants (
        merchant_id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        location TEXT NOT NULL,
        category TEXT NOT NULL,
        discount_cap_pct REAL NOT NULL DEFAULT 15.0,
        soundbox_status TEXT NOT NULL DEFAULT 'CONNECTED'
    )
    """)
    
    # Table: transactions
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS transactions (
        txn_id TEXT PRIMARY KEY,
        merchant_id TEXT NOT NULL,
        customer_hash TEXT NOT NULL,
        amount REAL NOT NULL,
        timestamp DATETIME NOT NULL,
        day_of_week INTEGER NOT NULL,
        hour INTEGER NOT NULL,
        payment_mode TEXT NOT NULL
    )
    """)
    
    # Table: customers
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS customers (
        customer_hash TEXT PRIMARY KEY,
        merchant_id TEXT NOT NULL,
        name TEXT NOT NULL,
        phone_masked TEXT NOT NULL,
        opt_in_marketing INTEGER NOT NULL DEFAULT 1,
        total_visits INTEGER NOT NULL DEFAULT 1,
        avg_spend REAL NOT NULL DEFAULT 150.0,
        last_visit_date DATETIME NOT NULL,
        last_contacted_date DATETIME
    )
    """)
    
    # Table: audit_logs
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        action_id TEXT NOT NULL,
        merchant_id TEXT NOT NULL,
        opportunity_type TEXT NOT NULL,
        evidence_hash TEXT NOT NULL,
        llm_prompt_hash TEXT NOT NULL,
        validator_status TEXT NOT NULL,
        verification_details TEXT NOT NULL,
        approval_timestamp DATETIME,
        execution_status TEXT NOT NULL,
        executor_used TEXT NOT NULL,
        payload_summary TEXT NOT NULL
    )
    """)
    
    conn.commit()
    
    # Check if merchant exists; if not, seed data
    cursor.execute("SELECT COUNT(*) FROM merchants WHERE merchant_id = 'm_bandra_01'")
    if cursor.fetchone()[0] == 0:
        seed_synthetic_data(conn)
    
    conn.close()

def seed_synthetic_data(conn):
    cursor = conn.cursor()
    merchant_id = 'm_bandra_01'
    
    cursor.execute("""
    INSERT INTO merchants (merchant_id, name, location, category, discount_cap_pct, soundbox_status)
    VALUES (?, ?, ?, ?, ?, ?)
    """, (merchant_id, "Demo Cafe", "Bandra, Mumbai", "QSR & Cafe", 15.0, "CONNECTED"))
    
    # Seed Customers (25 customers: 18 opted-in, 7 opted-out)
    customers = []
    names = [
        "Aarav Sharma", "Priya Patel", "Rohan Mehta", "Ananya Iyer", "Vikram Singh",
        "Neha Gupta", "Karan Joshi", "Siddharth Rao", "Pooja Verma", "Aditya Nair",
        "Meera Deshmukh", "Kabir Bhatia", "Riya Malhotra", "Amit Kumar", "Tanvi Shah",
        "Rahul Saxena", "Deepika Reddy", "Nikhil Chopra", "Shreya Das", "Varun Kapoor",
        "Ishaan Choudhury", "Sneha Kulkarni", "Gaurav Mishra", "Kavya Menon", "Harsh Vardhan"
    ]
    
    base_date = datetime.now() - timedelta(days=56)
    
    for i, name in enumerate(names):
        cust_hash = f"cust_hash_{i+1:03d}"
        phone_masked = f"+91 98*** *{i+10:02d}"
        opt_in = 1 if i < 18 else 0  # First 18 opted in
        total_visits = random.randint(5, 24)
        avg_spend = round(random.uniform(180, 260), 2)
        last_visit = datetime.now() - timedelta(days=random.randint(1, 14))
        # Last contacted > 7 days ago to satisfy frequency check
        last_contacted = datetime.now() - timedelta(days=random.randint(8, 25))
        
        cursor.execute("""
        INSERT INTO customers (customer_hash, merchant_id, name, phone_masked, opt_in_marketing, total_visits, avg_spend, last_visit_date, last_contacted_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (cust_hash, merchant_id, name, phone_masked, opt_in, total_visits, avg_spend, last_visit.strftime("%Y-%m-%d %H:%M:%S"), last_contacted.strftime("%Y-%m-%d %H:%M:%S")))
        customers.append((cust_hash, opt_in))
    
    # Seed 8 Weeks of hourly transaction data
    # Create realistic pattern: Mon-Fri 14:00-17:00 is DEAD HOUR (footfall drops ~54%)
    txns = []
    txn_id_counter = 1000
    
    start_date = datetime.now() - timedelta(days=56)
    
    for day in range(56):
        current_date = start_date + timedelta(days=day)
        day_of_week = current_date.weekday() # 0 = Mon, 1 = Tue, ..., 6 = Sun
        
        for hour in range(8, 23): # 8 AM to 10 PM (15 open hours)
            is_dead_hour = (day_of_week in [0, 1, 2, 3, 4]) and (14 <= hour < 17) # Mon-Fri 14:00-17:00
            
            if is_dead_hour:
                # Dead hour: only 1-3 transactions per hour
                num_txns = random.randint(1, 3)
            else:
                # Normal peak hour: 6-14 transactions per hour
                num_txns = random.randint(6, 14)
                
            for _ in range(num_txns):
                txn_id_counter += 1
                txn_id = f"TXN_{txn_id_counter}"
                # Select random customer
                cust_tuple = random.choice(customers)
                cust_hash = cust_tuple[0]
                
                amount = round(random.uniform(120.0, 320.0), 2)
                if is_dead_hour:
                    amount = round(random.uniform(90.0, 180.0), 2) # Lower ticket during dead hours
                
                minute = random.randint(0, 59)
                second = random.randint(0, 59)
                txn_time = current_date.replace(hour=hour, minute=minute, second=second)
                payment_mode = random.choice(["Paytm QR", "Paytm Soundbox", "Card", "UPI"])
                
                txns.append((
                    txn_id, merchant_id, cust_hash, amount,
                    txn_time.strftime("%Y-%m-%d %H:%M:%S"),
                    day_of_week, hour, payment_mode
                ))
    
    cursor.executemany("""
    INSERT INTO transactions (txn_id, merchant_id, customer_hash, amount, timestamp, day_of_week, hour, payment_mode)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, txns)
    
    conn.commit()
    print(f"Seeded SQLite DB with {len(txns)} transactions and 25 customers for merchant '{merchant_id}'")

def reset_db_data():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DROP TABLE IF EXISTS transactions")
    cursor.execute("DROP TABLE IF EXISTS customers")
    cursor.execute("DROP TABLE IF EXISTS merchants")
    cursor.execute("DROP TABLE IF EXISTS audit_logs")
    conn.commit()
    conn.close()
    init_db()
