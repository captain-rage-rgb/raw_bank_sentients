"""
Rawbank Sentient Fraud Intelligence Platform - Use Case 1: Command Centre Dashboard
File: Use Case 1 - Dashboard/backend/main.py
Port: 8000
Dedicated backend serving DuckDB analytics, KPIs, transaction queries, and alert queues.
"""

import os
import traceback
from typing import Optional
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from database import db

app = FastAPI(
    title="Rawbank Sentient - Use Case 01: Command Centre Dashboard API",
    version="2.0.0",
    description="Enterprise BFSI Analytics and Alert Triage Service for Rawbank DRC (Kinshasa)"
)

# CORS configuration allowing local frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "platform": "Rawbank Sentient Fraud Intelligence Platform",
        "use_case": "Use Case 01: Sentient Command Centre Dashboard",
        "status": "OPERATIONAL",
        "jurisdiction": "Rawbank DRC (Kinshasa)",
        "docs_url": "/docs",
        "engine": "DuckDB SQL Analytics"
    }


@app.get("/api/health")
def health_check():
    kpis = db.get_kpis()
    return {
        "status": "HEALTHY",
        "engine": "DuckDB Live",
        "total_monitored_txns": kpis.get("total_transactions", 0),
        "total_alerts": kpis.get("total_alerts", 0),
        "alert_rate_pct": kpis.get("alert_rate", 0),
        "exposure_usd": kpis.get("total_exposure_usd", 0)
    }


@app.get("/api/kpis")
def get_kpis():
    """
    Returns executive KPIs calculated dynamically over the canonical ground truth dataset:
    Total volume (USD & CDF), alerts count, alert rate, breakdown by severity,
    financial exposure at risk, and case queue statuses.
    """
    try:
        return db.get_kpis()
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to calculate KPIs: {str(e)}")


@app.get("/api/analytics")
def get_analytics():
    """
    Provides multi-dimensional analytical aggregations:
    - 90-day time-series anomaly velocity trend
    - Omnichannel threat exposure & alert rate per channel
    - Geographic concentration across DRC hubs
    - Entity risk intelligence: flagged shared devices and mule beneficiaries
    """
    try:
        return db.get_analytics()
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to aggregate analytics: {str(e)}")


@app.get("/api/alerts")
def get_alerts(
    page: int = Query(1, ge=1, description="Page number (1-indexed)"),
    page_size: int = Query(15, ge=1, le=100, description="Items per page"),
    severity: Optional[str] = Query(None, description="Filter by severity: CRITICAL, HIGH, MEDIUM, LOW"),
    channel: Optional[str] = Query(None, description="Filter by banking channel"),
    queue: Optional[str] = Query(None, description="Filter by analyst queue"),
    status: Optional[str] = Query(None, description="Filter by case status"),
    search: Optional[str] = Query(None, description="Search transaction_id, customer_name, or customer_id")
):
    """
    Paginated alert queue with multi-field search and triage filters.
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
@app.get("/api/transactions/{transaction_id}")
def get_transaction_drilldown(transaction_id: str):
    """
    360-degree forensic inspection profile for a selected transaction:
    - Customer profile & 90-day baseline median/average
    - Device footprint & multi-account hardware links
    - Auth & network security telemetry (VPN, IP risk, impossible travel)
    - Triggered rules FR-01 through FR-20 with weights and evidence details
    - Mitigating counter-evidence CE-01 through CE-05
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
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
