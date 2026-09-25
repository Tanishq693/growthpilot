from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import init_db
from app.api import briefing, opportunities, execution, simulation, audit

app = FastAPI(
    title="GrowthPilot API",
    description="SENSE → DIAGNOSE → DECIDE → VALIDATE → APPROVE → ACT → MEASURE",
    version="1.0.0"
)

# Enable CORS for React frontend (Vite dev server)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for seamless hackathon testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

app.include_router(briefing.router)
app.include_router(opportunities.router)
app.include_router(execution.router)
app.include_router(simulation.router)
app.include_router(audit.router)

@app.get("/")
def root():
    return {
        "app": "GrowthPilot Engine",
        "status": "ONLINE",
        "loop_stages": ["SENSE", "DIAGNOSE", "DECIDE", "VALIDATE", "APPROVE", "ACT", "MEASURE"],
        "docs_url": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
