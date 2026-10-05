# Use Case 02 — Rawbank Sentient Fraud Investigation Copilot

> **Rawbank DRC Fraud Intelligence Platform** | AI-Assisted Deep-Dive Investigation Portal

---

## Overview

The **Investigation Copilot** is a dedicated AI interrogation layer for Rawbank DRC compliance analysts. It enables natural-language deep-dive investigation of flagged transactions by combining:

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Structured Retrieval** | Pandas + RapidFuzz | Customer baselines, device graphs, beneficiary networks, velocity metrics |
| **Semantic Retrieval** | FAISS + `intfloat/multilingual-e5-small` | Passage similarity over transaction context cards |
| **Reasoning Engine** | Groq `openai/gpt-oss-20b` | LLM-powered investigation narrative |
| **Deterministic Fallback** | Rule-Based Synthesizer | 100% resilient sub-200ms responses when Groq is unavailable |

Every investigation response is structured under the **strict 7-part Section 12 schema**:

1. **Summary** — Plain-language risk verdict
2. **Behavioral Anomalies** — Deviations from customer baseline
3. **Network Intelligence** — Device / beneficiary linkage analysis
4. **Triggered Rules** — FR-01–FR-20 rule activations with weights
5. **Counter-Evidence** — CE-01–CE-05 mitigating factors
6. **Analyst Actions** — Prioritised next-step recommendations
7. **Confidence Score** — 0–100 composite risk confidence

---

## Ports

| Service | Port | URL |
|---------|------|-----|
| Backend (FastAPI) | **8001** | http://127.0.0.1:8001 |
| Frontend (Next.js) | **3001** | http://localhost:3001 |

---

## Prerequisites

- Python 3.11+ with pip
- Node.js 18+ with npm
- Shared dataset: `../RAWBANK_SENTIENT_KB.csv` (resolved automatically)
- *(Optional)* Groq API key for LLM-powered responses

---

## Configuration

Edit `backend/.env`:

```env
# Get your free key at: https://console.groq.com/keys
GROQ_API_KEY=your_key_here

BACKEND_PORT=8001
FRONTEND_PORT=3001
```

> If `GROQ_API_KEY` is blank or absent, the system automatically activates the **deterministic rule-based synthesizer** — no error, no degraded experience.

---

## Setup & Run

### 1. Install Python dependencies
```bash
cd backend
pip install -r requirements.txt
```

> **Note:** First run downloads the `intfloat/multilingual-e5-small` model (~120 MB) and builds the FAISS index. This is cached in `backend/cache/` for subsequent runs.

### 2. Start backend
```bash
# Option A — double-click
start_backend.bat

# Option B — terminal
cd backend
python -m uvicorn main:app --host 127.0.0.1 --port 8001 --reload
```

### 3. Install frontend dependencies
```bash
cd frontend
npm install
```

### 4. Start frontend
```bash
# Option A — double-click
start_frontend.bat

# Option B — terminal
cd frontend
npm run dev
```

### 5. Open Copilot
Navigate to → **http://localhost:3001**

---

## Project Structure

```
usecase_02_investigation_copilot/
├── backend/
│   ├── main.py            # FastAPI routes (/api/copilot/chat, /api/copilot/transactions, /api/copilot/suggestions)
│   ├── copilot.py         # Groq LLM orchestrator + deterministic fallback + Section 12 normalizer
│   ├── retrieval.py       # Dual retrieval: Pandas+RapidFuzz (structured) + FAISS (semantic)
│   ├── rules_meta.py      # FR-01–FR-20 fraud rules + CE-01–CE-05 counter-evidence catalog
│   ├── .env               # GROQ_API_KEY + port config
│   ├── cache/             # FAISS index + SHA-256 validation cache (auto-generated)
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/           # Next.js App Router (layout, page, globals.css)
│   │   ├── components/    # CopilotChat, CopilotHeader, Section12Report, TransactionSpotlight
│   │   ├── lib/api.ts     # Typed API client functions (port 8001)
│   │   └── types/         # TypeScript interface definitions
│   ├── next.config.ts     # Proxies /api/* → http://127.0.0.1:8001
│   └── package.json
├── start_backend.bat
├── start_frontend.bat
└── README.md
```

---

## API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | System health + FAISS cache status + Groq availability |
| `/api/copilot/transactions` | GET | List flagged transactions (for sidebar picker) |
| `/api/copilot/suggestions/{id}` | GET | 1-click prompt chips for a transaction |
| `/api/copilot/chat` | POST | Full 7-part Section 12 investigation report |
| `/api/copilot/context/{id}` | GET | Raw context packet passed to the reasoning engine |

---

## Zero Dashboard Dependencies

This use case is **completely independent** of Use Case 01. It has its own:
- Backend (port 8001)
- Frontend (port 3001)
- Python virtual environment
- Node.js dependencies
