from fastapi import APIRouter, Query
from datetime import datetime
from app.schemas import ApproveRequest, ExecutionResult
from app.execution.mock_executor import MockExecutor
from app.execution.paytm_executor import PaytmExecutor
from app.database import get_db_connection

router = APIRouter(prefix="/api/execution", tags=["Execution"])

@router.post("/approve", response_model=ExecutionResult)
def approve_and_execute(req: ApproveRequest, executor_mode: str = Query("MockExecutor", description="MockExecutor or PaytmStagingAPI")):
    campaign_data = {
        "audience_count": 18,
        "discount_pct": 15.0,
        "action_id": req.action_id
    }
    
    if executor_mode == "PaytmStagingAPI":
        executor = PaytmExecutor()
    else:
        executor = MockExecutor()
        
    res = executor.execute_campaign(req.action_id, req.merchant_id, campaign_data)
    
    # Update Audit Log
    conn = get_db_connection()
    cursor = conn.cursor()
    approval_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    cursor.execute("""
    UPDATE audit_logs 
    SET approval_timestamp = ?, execution_status = ?, executor_used = ?
    WHERE action_id = ?
    """, (approval_time, res["status"], res["executor_type"], req.action_id))
    conn.commit()
    conn.close()
    
    return res
