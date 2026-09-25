from fastapi import APIRouter, Query
import json
import hashlib
from datetime import datetime
from app.schemas import OpportunityResponse, MerchantInfo
from app.detectors.dead_hour import detect_dead_hours
from app.ai.planner import generate_campaign_proposal, get_fallback_template
from app.ai.validator import validate_campaign
from app.database import get_db_connection

router = APIRouter(prefix="/api/opportunities", tags=["Opportunities"])

@router.get("", response_model=OpportunityResponse)
def get_opportunity(merchant_id: str = "m_bandra_01", demo_mode: str = Query("dead_hour", description="dead_hour or healthy_day")):
    merchant = MerchantInfo(
        merchant_id=merchant_id,
        name="Demo Cafe",
        location="Bandra, Mumbai",
        category="QSR & Cafe",
        discount_cap_pct=15.0,
        soundbox_status="CONNECTED"
    )
    
    if demo_mode == "healthy_day":
        return OpportunityResponse(
            has_opportunity=False,
            opportunity_type="HEALTHY_DAY",
            merchant=merchant,
            evidence=None,
            proposal=None,
            validation=None
        )
        
    # Run SENSE (pandas detector)
    evidence_dict = detect_dead_hours(merchant_id)
    
    # Run DECIDE (AI Planner)
    proposal_dict = generate_campaign_proposal(evidence_dict)
    
    # Run VALIDATE (Deterministic Validator)
    validation_dict = validate_campaign(proposal_dict, evidence_dict, merchant_cap_pct=15.0)
    
    # If validation failed twice or triggered fallback, use template
    if not validation_dict["is_valid"]:
        proposal_dict = get_fallback_template(evidence_dict)
        validation_dict["safety_fallback_triggered"] = True
        
    # Log to Audit Log DB
    conn = get_db_connection()
    cursor = conn.cursor()
    
    evidence_hash = "sha256_" + hashlib.sha256(json.dumps(evidence_dict, sort_keys=True).encode()).hexdigest()[:12]
    
    cursor.execute("""
    INSERT INTO audit_logs (action_id, merchant_id, opportunity_type, evidence_hash, llm_prompt_hash, validator_status, verification_details, approval_timestamp, execution_status, executor_used, payload_summary)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        proposal_dict["action_id"],
        merchant_id,
        "DEAD_HOUR",
        evidence_hash,
        proposal_dict["llm_prompt_hash"],
        validation_dict["verdict"],
        json.dumps(validation_dict["checks"]),
        None, # Not approved yet
        "PENDING_MERCHANT_APPROVAL",
        "MockExecutor",
        f"Dead Hour 2-5 PM campaign for {evidence_dict['opted_in_regulars_count']} opted-in regulars with 15% OFF"
    ))
    conn.commit()
    conn.close()
    
    return OpportunityResponse(
        has_opportunity=True,
        opportunity_type="DEAD_HOUR",
        merchant=merchant,
        evidence=evidence_dict,
        proposal=proposal_dict,
        validation=validation_dict
    )
