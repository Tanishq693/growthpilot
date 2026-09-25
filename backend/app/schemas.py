from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class MerchantInfo(BaseModel):
    merchant_id: str
    name: str
    location: str
    category: str
    discount_cap_pct: float
    soundbox_status: str

class VoiceBriefing(BaseModel):
    merchant_id: str
    merchant_name: str
    yesterday_collection: float
    transcript_hi: str
    transcript_en: str
    has_opportunity: bool
    opportunity_summary: str

class EvidencePayload(BaseModel):
    detector_name: str
    merchant_id: str
    detected_at: str
    dead_hours: List[int]
    dead_hour_str: str
    median_open_hour_revenue: float
    dead_hour_avg_revenue: float
    drop_percentage: float
    weeks_analyzed: int
    matching_weeks_count: int
    targeted_regulars_count: int
    opted_in_regulars_count: int
    avg_ticket_size: float
    potential_upside: float
    max_discount_cost: float
    expected_net_impact: float
    confidence_score: int
    raw_pandas_metrics: Dict[str, Any]

class CampaignProposal(BaseModel):
    action_id: str
    opportunity_type: str
    campaign_title: str
    campaign_tagline_hi: str
    campaign_tagline_en: str
    discount_pct: float
    offer_code: str
    target_window: str
    audience_count: int
    estimated_net_uplift: float
    llm_prompt_hash: str
    is_fallback_template: bool

class ValidationReport(BaseModel):
    is_valid: bool
    verdict: str
    checks: Dict[str, Dict[str, Any]] # numbers_check, policy_check, audience_check, frequency_check
    fail_reasons: List[str]
    safety_fallback_triggered: bool

class OpportunityResponse(BaseModel):
    has_opportunity: bool
    opportunity_type: str # 'DEAD_HOUR' or 'HEALTHY_DAY'
    merchant: MerchantInfo
    evidence: Optional[EvidencePayload] = None
    proposal: Optional[CampaignProposal] = None
    validation: Optional[ValidationReport] = None

class ApproveRequest(BaseModel):
    action_id: str
    merchant_id: str
    approval_source: str = Field(default="UI_BUTTON", description="UI_BUTTON or VOICE_TRIGGER")

class DispatchedCustomer(BaseModel):
    customer_name: str
    phone_masked: str
    status: str
    channel: str
    message_text: str
    delivered_at: str

class ExecutionResult(BaseModel):
    action_id: str
    status: str
    paytm_link: str
    qr_code_svg: str
    target_audience_count: int
    executor_type: str # 'MockExecutor' or 'PaytmStagingAPI'
    dispatched_at: str
    dispatched_customers: List[DispatchedCustomer] = []

class SimulationRequest(BaseModel):
    redemption_rate: float = Field(default=0.25, ge=0.05, le=0.50)
    demo_mode: str = Field(default="dead_hour", description="dead_hour or healthy_day")

class HourlyRevenue(BaseModel):
    hour_label: str
    baseline_revenue: float
    simulated_revenue: float
    is_dead_hour: bool

class SimulationResponse(BaseModel):
    redemption_rate: float
    simulated_uplift_pct: float
    gross_incremental: float
    discount_burn: float
    net_impact: float
    hourly_chart_data: List[HourlyRevenue]

class AuditLogItem(BaseModel):
    id: int
    action_id: str
    merchant_id: str
    opportunity_type: str
    evidence_hash: str
    llm_prompt_hash: str
    validator_status: str
    verification_details: str
    approval_timestamp: Optional[str] = None
    execution_status: str
    executor_used: str
    payload_summary: str
