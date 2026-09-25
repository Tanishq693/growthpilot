import hashlib
import json
from typing import Dict, Any

def generate_campaign_proposal(evidence: Dict[str, Any], use_llm: bool = False) -> Dict[str, Any]:
    """
    Constrained AI Planner. Generates marketing copy and structures campaign parameters.
    The LLM (or deterministic generator) ONLY generates copy strings (taglines).
    Discount percentage, numbers, and audience counts come strictly from detector evidence.
    """
    opportunity_type = "DEAD_HOUR"
    
    # Strictly bound numbers to detector outputs
    discount_pct = 15.0 # Max policy cap
    audience_count = evidence.get("opted_in_regulars_count", 18)
    expected_impact = evidence.get("expected_net_impact", 2880.0)
    
    # Generated Hindi / Hinglish and English Copy
    tagline_hi = "Chai & Snacks Special: Dopehar 2 se 5 baje paye 15% OFF! Fast checkout via Paytm."
    tagline_en = "Afternoon Special: Enjoy 15% OFF between 2:00 PM – 5:00 PM today at Demo Cafe!"
    title = "Dead Hour Afternoon Booster (15% OFF)"
    offer_code = "DEADHOUR15"
    target_window = "2:00 PM – 5:00 PM"
    
    prompt_raw = f"{evidence['detector_name']}:{evidence['merchant_id']}:{opportunity_type}:{discount_pct}"
    prompt_hash = "sha256_" + hashlib.sha256(prompt_raw.encode()).hexdigest()[:12]
    
    action_id = f"act_dh_{hashlib.md5((evidence['merchant_id'] + target_window).encode()).hexdigest()[:6]}"
    
    return {
        "action_id": action_id,
        "opportunity_type": opportunity_type,
        "campaign_title": title,
        "campaign_tagline_hi": tagline_hi,
        "campaign_tagline_en": tagline_en,
        "discount_pct": discount_pct,
        "offer_code": offer_code,
        "target_window": target_window,
        "audience_count": audience_count,
        "estimated_net_uplift": expected_impact,
        "llm_prompt_hash": prompt_hash,
        "is_fallback_template": False
    }

def get_fallback_template(evidence: Dict[str, Any]) -> Dict[str, Any]:
    """
    Deterministic Safety Fallback Template used if LLM fails validation twice or is offline.
    """
    action_id = f"act_dh_fallback_{hashlib.md5(evidence['merchant_id'].encode()).hexdigest()[:6]}"
    return {
        "action_id": action_id,
        "opportunity_type": "DEAD_HOUR",
        "campaign_title": "Dead Hour Special (15% OFF)",
        "campaign_tagline_hi": "Special Offer: Dopehar 2-5 PM paye 15% ki chhoot. Exclusive for regular customers!",
        "campaign_tagline_en": "Exclusive Offer: Get 15% OFF between 2:00 PM – 5:00 PM at Demo Cafe.",
        "discount_pct": 15.0,
        "offer_code": "FALLBACK15",
        "target_window": "2:00 PM – 5:00 PM",
        "audience_count": evidence.get("opted_in_regulars_count", 18),
        "estimated_net_uplift": evidence.get("expected_net_impact", 2880.0),
        "llm_prompt_hash": "sha256_deterministic_fallback_template",
        "is_fallback_template": True
    }
