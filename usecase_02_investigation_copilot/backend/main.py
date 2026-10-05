"""
Rawbank Sentient Fraud Intelligence Platform - Use Case 2: Fraud Investigation Copilot
File: Use Case 2 - Copilot/backend/main.py
Port: 8001
Dedicated backend serving Groq LLM + FAISS dual-retrieval fraud interrogation endpoints.
"""

import os
import traceback
from typing import Optional, List
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from copilot import copilot
from retrieval import retrieval_engine

app = FastAPI(
    title="Rawbank Sentient - Use Case 02: Fraud Investigation Copilot API",
    version="2.0.0",
    description="Enterprise BFSI AI Copilot & Forensics Reasoning Service for Rawbank DRC (Kinshasa)"
)

# CORS configuration allowing local frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class CopilotChatRequest(BaseModel):
    transaction_id: str = Field(..., description="Target transaction ID from canonical KB (e.g. 'TXN-SYN0000001')")
    query: Optional[str] = Field(None, description="Natural language investigation question or triage instruction")


@app.get("/")
def root():
    return {
        "platform": "Rawbank Sentient Fraud Intelligence Platform",
        "use_case": "Use Case 02: Sentient Fraud Investigation Copilot",
        "status": "OPERATIONAL",
        "jurisdiction": "Rawbank DRC (Kinshasa)",
        "docs_url": "/docs",
        "engine": "Groq LLM + Deterministic Section 12 Fallback + FAISS E5-Small Dual Retrieval",
        "port": 8001
    }


@app.get("/api/health")
def health_check():
    has_groq = copilot._get_groq_client() is not None
    total_txns = len(retrieval_engine.df) if retrieval_engine.df is not None else 0
    return {
        "status": "HEALTHY",
        "use_case": "Use Case 02: Copilot",
        "groq_configured": has_groq,
        "active_models": ["openai/gpt-oss-120b", "openai/gpt-oss-20b", "deterministic-rule-synthesizer"],
        "retrieval_records": total_txns,
        "vector_cache_loaded": retrieval_engine.faiss_index is not None and retrieval_engine.faiss_index.ntotal > 0
    }


@app.post("/api/copilot/chat")
def copilot_chat(req: CopilotChatRequest):
    """
    Executes an AI-assisted fraud investigation interrogation turn for a transaction.
    Combines deterministic ground truth telemetry with FAISS semantic similarity and
    generates a structured 7-part investigation report under Section 12 requirements.
    """
    try:
        res = copilot.investigate(req.transaction_id, req.query or "")
        return res
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Copilot investigation failed: {str(e)}")


@app.get("/api/copilot/suggestions/{transaction_id}")
def get_copilot_suggestions(transaction_id: str):
    """
    Returns context-aware 1-click prompt chips tailored to the transaction alert pattern.
    """
    try:
        return {"suggestions": copilot.get_suggestions(transaction_id)}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to generate suggestions: {str(e)}")


@app.get("/api/copilot/transactions")
def get_flagged_transactions(
    limit: int = Query(50, ge=1, le=500, description="Max transactions to return"),
    search: Optional[str] = Query(None, description="Search by transaction ID, customer, or pattern")
):
    """
    Lists flagged transactions with rich context to enable easy 1-click interrogation
    in the standalone Copilot portal.
    """
    try:
        df = retrieval_engine.df
        if df is None or len(df) == 0:
            return {"transactions": [], "total": 0}

        # Filter flagged transactions
        flagged = df[df["alert_severity"].isin(["CRITICAL", "HIGH", "MEDIUM", "LOW"])].copy()

        if search and search.strip():
            s = search.strip().lower()
            mask = (
                flagged["transaction_id"].str.lower().str.contains(s, na=False) |
                flagged["customer_name"].str.lower().str.contains(s, na=False) |
                flagged["customer_id"].str.lower().str.contains(s, na=False) |
                flagged["alert_primary_pattern"].str.lower().str.contains(s, na=False)
            )
            flagged = flagged[mask]

        flagged = flagged.sort_values(by="alert_score", ascending=False).head(limit)

        records = []
        for _, row in flagged.iterrows():
            records.append({
                "transaction_id": str(row.get("transaction_id", "")),
                "timestamp": str(row.get("event_timestamp_local", "")),
                "customer_id": str(row.get("customer_id", "")),
                "customer_name": str(row.get("customer_name", "")),
                "customer_segment": str(row.get("customer_segment", "")),
                "channel": str(row.get("channel", "")),
                "channel_action": str(row.get("channel_action", "")),
                "amount_usd_equiv": float(row.get("amount_usd_equiv", 0.0) or 0.0),
                "alert_score": int(row.get("alert_score", 0) or 0),
                "alert_severity": str(row.get("alert_severity", "")),
                "alert_primary_pattern": str(row.get("alert_primary_pattern", "")),
                "city": str(row.get("txn_city", "")),
            })

        return {"transactions": records, "total": len(records)}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to list transactions: {str(e)}")


@app.get("/api/copilot/context/{transaction_id}")
def get_transaction_context(transaction_id: str):
    """
    Returns the unified ground truth context packet passed to the reasoning engine.
    """
    try:
        ctx = copilot.build_context(transaction_id)
        if "error" in ctx:
            raise HTTPException(status_code=404, detail=ctx["error"])
        return ctx
    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to build context: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8001, reload=True)
