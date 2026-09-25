from fastapi import APIRouter
from app.schemas import VoiceBriefing

router = APIRouter(prefix="/api/briefing", tags=["Voice Briefing"])

@router.get("", response_model=VoiceBriefing)
def get_morning_briefing(merchant_id: str = "m_bandra_01"):
    return VoiceBriefing(
        merchant_id=merchant_id,
        merchant_name="Demo Cafe - Bandra",
        yesterday_collection=14200.0,
        transcript_hi="Namaste Rameshji. Kal ka collection ₹14,200 tha. Aaj ek high-confidence growth opportunity identify hua hai.",
        transcript_en="Namaste Rameshji. Yesterday's total collection was ₹14,200. A high-confidence growth opportunity has been identified for today.",
        has_opportunity=True,
        opportunity_summary="Dead Hour Detected (2:00 PM – 5:00 PM). Potential net impact: +₹2,880."
    )
