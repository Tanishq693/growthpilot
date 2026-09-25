from fastapi import APIRouter
from typing import List
from app.schemas import AuditLogItem
from app.database import get_db_connection, reset_db_data

router = APIRouter(prefix="/api/audit", tags=["Audit Log & System"])

@router.get("", response_model=List[AuditLogItem])
def get_audit_logs(merchant_id: str = "m_bandra_01"):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT id, action_id, merchant_id, opportunity_type, evidence_hash, llm_prompt_hash, validator_status, verification_details, approval_timestamp, execution_status, executor_used, payload_summary
    FROM audit_logs
    ORDER BY id DESC
    LIMIT 20
    """)
    rows = cursor.fetchall()
    conn.close()
    
    logs = []
    for r in rows:
        logs.append(AuditLogItem(
            id=r["id"],
            action_id=r["action_id"],
            merchant_id=r["merchant_id"],
            opportunity_type=r["opportunity_type"],
            evidence_hash=r["evidence_hash"],
            llm_prompt_hash=r["llm_prompt_hash"],
            validator_status=r["validator_status"],
            verification_details=r["verification_details"],
            approval_timestamp=r["approval_timestamp"],
            execution_status=r["execution_status"],
            executor_used=r["executor_used"],
            payload_summary=r["payload_summary"]
        ))
    return logs

@router.post("/reset")
def reset_demo_state():
    reset_db_data()
    return {"status": "SUCCESS", "message": "Demo data reset successfully to initial SENSE state."}
