# Use Case 01 — Rawbank Sentient Command Centre Dashboard

> **Rawbank DRC Fraud Intelligence Platform** | Standalone BI & Alert Triage Dashboard

---

## Overview

The **Command Centre Dashboard** is a real-time, enterprise-grade fraud monitoring hub for Rawbank DRC analysts. It ingests `RAWBANK_SENTIENT_KB.csv` (2,500 canonical transaction records) via an in-memory DuckDB engine and surfaces:

| Feature | Description |
|---------|-------------|
| **KPI Ribbon** | Total transactions, total volume (USD/CDF), alert count, alert rate, exposure at risk |
| **Time-Series Charts** | 90-day alert velocity trend by severity |
| **Channel Analytics** | Per-channel threat exposure and alert rate (Mobile, ATM, SWIFT, Branch, POS, Web) |
| **Geographic Heatmap** | City-level concentration across DRC hubs |
| **Alert Queue** | Paginated, multi-filter triage table with severity, channel, queue, and free-text search |
| **Forensic Drawer** | 360° transaction drill-down: customer baseline, device graph, triggered fraud rules FR-01–FR-20, counter-evidence CE-01–CE-05 |

---

## Ports

| Service | Port | URL |
|---------|------|-----|
| Backend (FastAPI) | **8000** | http://127.0.0.1:8000 |
| Frontend (Next.js) | **3000** | http://localhost:3000 |

---

## Prerequisites

- Python 3.11+ with pip
- Node.js 18+ with npm
- Shared dataset: `../RAWBANK_SENTIENT_KB.csv` (resolved automatically by backend)

---

## Setup & Run

### 1. Install Python dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Start backend
```bash
# Option A — double-click
start_backend.bat

# Option B — terminal
cd backend
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
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

### 5. Open Dashboard
Navigate to → **http://localhost:3000**

---

## Project Structure

```
usecase_01_command_centre/
├── backend/
│   ├── main.py            # FastAPI routes (/api/kpis, /api/analytics, /api/alerts, /api/transaction/{id})
│   ├── database.py        # DuckDB analytics engine + all SQL aggregations
│   ├── rules_meta.py      # FR-01–FR-20 fraud rules + CE-01–CE-05 counter-evidence catalog
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/           # Next.js App Router (layout, page, globals.css)
│   │   ├── components/    # AlertsTable, ChartsGrid, ForensicDrawer, KpiRibbon, Sidebar, TopNavbar
│   │   ├── lib/api.ts     # Typed API client functions
│   │   └── types/         # TypeScript interface definitions
│   ├── next.config.ts     # Proxies /api/* → http://127.0.0.1:8000
│   └── package.json
├── start_backend.bat
├── start_frontend.bat
└── README.md
```

---

## API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | System health + KPI summary |
| `/api/kpis` | GET | Executive KPIs derived from CSV |
| `/api/analytics` | GET | Time-series, channel, geo, entity aggregations |
| `/api/alerts` | GET | Paginated alert queue with filters |
| `/api/transaction/{id}` | GET | Full forensic drilldown for one transaction |

---

## No External Dependencies

This use case has **zero LLM, FAISS, or Copilot dependencies**. It runs entirely on:
- DuckDB (in-memory SQL)
- Pandas
- FastAPI + Uvicorn
