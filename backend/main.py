"""
Rawbank Sentient Fraud Intelligence Platform - FastAPI Server
File: backend/main.py
Powers the Sentient Command Centre (Use Case 01) with live DuckDB analytics over RAWBANK_SENTIENT_KB.csv.
"""

import traceback
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, Dict, Any
from database import db

app = FastAPI(
    title="Rawbank Sentient Fraud Intelligence Platform API",
    version="1.0.0",
    description="Enterprise BFSI Real-Time Command Centre & Fraud Intelligence Platform for Rawbank DRC."
)

# Enable CORS for Next.js frontend (default port 3000, 3001, etc.)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "platform": "Rawbank Sentient Fraud Intelligence Platform",
        "version": "1.0.0",
        "use_case": "Use Case 01: Sentient Command Centre"
    }

@app.get("/api/kpis")
def get_kpis():
    """
    Returns executive command center KPIs:
    Total transactions, volume USD/CDF, alerts, alert rate, severity breakdown, exposure, and open cases.
    """
    try:
        return db.get_kpis()
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to compute KPIs: {str(e)}")

@app.get("/api/analytics")
def get_analytics():
    """
    Returns rich analytics:
    - Daily alert & transaction volume trends
    - Omnichannel risk breakdown
    - Geographic distribution (DRC hubs & international)
    - Top risky entities (customers, mule beneficiaries, flagged shared devices)
    """
    try:
        return db.get_analytics()
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to generate analytics: {str(e)}")

@app.get("/api/alerts")
def get_alerts(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(15, ge=1, le=100, description="Page size"),
    severity: Optional[str] = Query(None, description="Filter by severity: CRITICAL, HIGH, MEDIUM, LOW, ALL"),
    channel: Optional[str] = Query(None, description="Filter by channel: ILLICOCASH, RAWBANK_ONLINE, CARD, etc."),
    queue: Optional[str] = Query(None, description="Filter by analyst queue: DIGITAL_FRAUD, CARD_FRAUD, etc."),
    status: Optional[str] = Query(None, description="Filter by case status: NEW, IN_REVIEW, ESCALATED, CLOSED, ALL"),
    search: Optional[str] = Query(None, description="Search transaction_id, customer_id, customer_name, narration")
):
    """
    Searchable and paginated alert feed with multi-criteria operational filtering.
    """
    try:
        return db.get_alerts(
            page=page,
            page_size=page_size,
            severity=severity,
            channel=channel,
            queue=queue,
            status=status,
            search=search
        )
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to retrieve alerts: {str(e)}")

@app.get("/api/transaction/{transaction_id}")
def get_transaction_drilldown(transaction_id: str):
    """
    360-degree forensic drill-down for a selected transaction:
    Customer profile & 90d baseline, device footprint, auth telemetry, triggered rules FR-01 to FR-20,
    counter-evidence analysis, case assignment, and Copilot reasoning placeholder.
    """
    try:
        result = db.get_transaction_drilldown(transaction_id)
        if not result:
            raise HTTPException(status_code=404, detail=f"Transaction '{transaction_id}' not found in canonical KB.")
        return result
    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to retrieve transaction: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
