from fastapi import APIRouter
from app.schemas import SimulationRequest, SimulationResponse
from app.simulation.simulator import run_simulation

router = APIRouter(prefix="/api/simulation", tags=["Simulation"])

@router.post("", response_model=SimulationResponse)
def simulate_campaign_impact(req: SimulationRequest, merchant_id: str = "m_bandra_01"):
    res = run_simulation(redemption_rate=req.redemption_rate, merchant_id=merchant_id, demo_mode=req.demo_mode)
    return res
