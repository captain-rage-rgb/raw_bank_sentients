# Rawbank Sentient Fraud Intelligence Platform - System Architecture & Technical Flow

## 1. Bank User Experience (Operational Lifecycle)

In a tier-1 commercial bank such as **Rawbank DRC (Kinshasa)**, fraud analysts, operations officers, and compliance leads operate across two distinct operational surfaces:
1. **Sentient Command Centre Dashboard (Use Case 01)** for real-time portfolio-level surveillance, triage prioritization, and queue dispatch.
2. **Sentient Fraud Investigation Copilot (Use Case 02)** for deep-dive cognitive interrogation, forensic hypothesis testing, and SAR drafting.

```
+-----------------------------------------------------------------------------------+
|                            BANK USER OPERATIONAL FLOW                             |
+-----------------------------------------------------------------------------------+
                                          |
                        1. Authentication & Role Validation
                                          |
                     +--------------------+--------------------+
                     |                                         |
                     v                                         v
   +------------------------------------+   +------------------------------------+
   |       USE CASE 01: DASHBOARD       |   |       USE CASE 02: COPILOT         |
   |     (Port 3000 / API: 8000)        |   |     (Port 3001 / API: 8001)        |
   +------------------------------------+   +------------------------------------+
   | * View Executive KPIs & Volumes    |   | * Select/Search Flagged Anomaly    |
   | * Monitor 90-Day Threat Timelines  |   | * Ask Natural Language Question    |
   | * Inspect Omnichannel Exposure     |   | * Dual-Retrieval Grounding         |
   | * Review Mule Syndicates & Devices |   | * Groq LLM Forensic Synthesis      |
   | * Filter & Sort Alert Triage Queue |   | * Review 7-Part Section 12 Report  |
   | * Open 360° Forensic Drawer        |   | * Frontline Case Disposition       |
   | * Execute Debit Hold / Escalation  |   | * Log to Core Banking Audit Ledger |
   +------------------------------------+   +------------------------------------+
```

---

## 2. Technical System Flows

### A. Dashboard Flow (Use Case 01)
1. **User Access**:
   The analyst accesses `http://localhost:3000`. Next.js executes client hydration with `suppressHydrationWarning` to protect against browser extension attribute mutations (such as Dark Reader).
2. **Data Ingestion & In-Memory Loading**:
   On load, Next.js calls the dedicated Dashboard API on `http://127.0.0.1:8000`:
   - `GET /api/kpis`: Ingests `shared/data/RAWBANK_SENTIENT_KB.csv` into an in-memory DuckDB table. Computes total volume (USD & CDF), alert counts by severity, alert rate (15.0%), and total financial exposure ($3.46M USD).
   - `GET /api/analytics`: Computes daily rolling anomaly velocity, omnichannel volume and alert distributions, geographic concentrations across DRC provinces, multi-account device links (`FR-13`), and high-fan-in mule counterparties (`FR-14`).
   - `GET /api/alerts`: Retrieves paginated, sorted, and filtered alert records with support for severity tabs, channel dropdowns, queue selectors, and text search.
3. **Forensic Inspection**:
   When an analyst clicks any row or the *"360° Inspect"* button:
   - Next.js fetches `GET /api/transaction/{transaction_id}`.
   - A slide-over drawer opens displaying 3 forensic tabs:
     * **Rules & Evidence**: Triggered rules `FR-01`..`FR-20` with weights and deductions from mitigating counter-evidence `CE-01`..`CE-05`.
     * **Customer Baseline**: 90-day median, 30-day average, ratio to median, relationship tenure, and KYC risk band.
     * **Device & Auth Telemetry**: Hardware ID, trusted status, IP risk, VPN/proxy, impossible travel velocity, and SIM swap telemetry.
   - The analyst can execute immediate operational disposition (*"Place Debit Hold"*, *"Escalate to Tier 2"*, or *"Mark Legitimate"*).
   - **Crucially, the Copilot functionality is completely absent from this project.**

---

### B. Copilot Flow (Use Case 02)
1. **User Access & Selection**:
   The investigator accesses `http://localhost:3001`. The portal loads flagged transactions from `http://127.0.0.1:8001/api/copilot/transactions`.
2. **Ground Truth Dual-Retrieval Layer**:
   When a transaction is investigated:
   - **Structured Retrieval**: Pandas queries calculate the customer's 90-day behavioral baseline (median, count), 10m sliding count, 1h outbound amount, hardware link graph (distinct accounts seen on device), and counterparty fan-in velocity (distinct senders in 30 days).
   - **Semantic Retrieval**: Sentence-Transformers (`intfloat/multilingual-e5-small`) transforms the transaction context into a 384-dimensional dense vector and searches the cached **FAISS IndexFlatL2** index for the top-3 historically similar incident cards.
3. **AI Reasoning & Safety Constraints**:
   - The unified context packet is passed to Groq Cloud API using `openai/gpt-oss-120b` (or `openai/gpt-oss-20b` fallback).
   - **Safety Boundary**: The model is prohibited from outputting `"CONFIRMED_FRAUD"` and must use probabilistic language (*"The available evidence is consistent with possible account takeover"*).
   - **Zero Hallucination Constraint**: The model can only cite facts present in the provided telemetry; missing data must be explicitly reported under *Evidence Gaps*.
4. **Schema Normalization**:
   The response is parsed and passed through `_normalize_investigation()`. Even if the LLM omits keys or returns partial JSON, the normalizer validates and guarantees that all 7 Section 12 sections are non-empty arrays/objects.
5. **Visual Output & Disposition**:
   The 7-part report renders cleanly in the portal with quick-action prompt chips and case disposition buttons.

---

## 3. Overall Architecture Diagram

```
+------------------------------------------------------------------------------------+
|                                    RAW BANK DRC                                    |
|                      CANONICAL DATASET (shared/data/RAWBANK_SENTIENT_KB.csv)       |
+------------------------------------------------------------------------------------+
                             |                                  |
                             |                                  |
                             v                                  v
+------------------------------------------+  +------------------------------------------+
|          USE CASE 01: DASHBOARD          |  |           USE CASE 02: COPILOT           |
+------------------------------------------+  +------------------------------------------+
| [Backend: Port 8000]                     |  | [Backend: Port 8001]                     |
|  * FastAPI Service                       |  |  * FastAPI Service                       |
|  * DuckDB In-Memory Analytics Engine     |  |  * Groq High-Speed LLM Orchestrator      |
|  * Thread-safe SQL Aggregations          |  |  * SentenceTransformers (E5-Small)       |
|  * Endpoints:                            |  |  * FAISS IndexFlatL2 Vector Cache        |
|    - GET /api/kpis                       |  |  * Structured Pandas Baseline Evaluator  |
|    - GET /api/analytics                  |  |  * Section 12 Normalizer (7 sections)    |
|    - GET /api/alerts                     |  |  * Endpoints:                            |
|    - GET /api/transaction/{id}           |  |    - POST /api/copilot/chat              |
|                                          |  |    - GET  /api/copilot/suggestions/{id}  |
|                                          |  |    - GET  /api/copilot/transactions      |
+------------------------------------------+  +------------------------------------------+
                     |                                              |
                     v                                              v
+------------------------------------------+  +------------------------------------------+
| [Frontend: Port 3000]                    |  | [Frontend: Port 3001]                    |
|  * Next.js (React 19 + TypeScript)       |  |  * Next.js (React 19 + TypeScript)       |
|  * Redesigned White/Off-White/Apricot    |  |  * Dedicated AI Investigation Portal     |
|  * Sidebar Navigation & Top Navbar       |  |  * Transaction Spotlight & Selector      |
|  * 4 Dynamic KPI Cards                   |  |  * Interactive Prompt & Prompt Chips     |
|  * Anomaly Timeline & Channel Bar Charts |  |  * 7-Part Section 12 Report Cards       |
|  * Entity Risk Cards (Devices, Mules)    |  |  * Frontline Disposition Logging         |
|  * Alerts Triage Table with Search       |  |  * Defensive safeArray Rendering         |
|  * 360° Forensic Drawer (No Copilot)    |  |                                          |
+------------------------------------------+  +------------------------------------------+
```

---

## 4. Final Directory Structure

```text
e:\raw_bank_sentients\
│
├── Use Case 1 - Dashboard/
│   ├── backend/
│   │   ├── database.py             # DuckDB analytics engine
│   │   ├── rules_meta.py           # FR-01..FR-20 & CE-01..CE-05 catalogs
│   │   ├── main.py                 # FastAPI service (Port 8000)
│   │   ├── requirements.txt
│   │   └── run_backend.bat
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── globals.css     # Redesigned White + Soft Apricot styling
│   │   │   │   ├── layout.tsx      # suppressHydrationWarning root layout
│   │   │   │   └── page.tsx        # Main Command Centre Dashboard
│   │   │   ├── components/
│   │   │   │   ├── Sidebar.tsx     # Operational sidebar navigation
│   │   │   │   ├── TopNavbar.tsx   # Top header with live indicators & refresh
│   │   │   │   ├── KpiRibbon.tsx   # 4 Executive KPI cards
│   │   │   │   ├── ChartsGrid.tsx  # Timeline & omnichannel charts
│   │   │   │   ├── AlertsTable.tsx # Triage queue with filters & pagination
│   │   │   │   └── ForensicDrawer.tsx # 360° forensic inspection (No Copilot)
│   │   │   ├── lib/
│   │   │   │   └── api.ts          # Client API calls to Port 8000
│   │   │   └── types/
│   │   │       └── index.ts        # Dashboard TypeScript interfaces
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── next.config.ts
│   │   └── run_frontend.bat        # Port 3000 launcher
│   ├── run_dashboard.bat           # 1-Click launcher for Use Case 1
│   └── README.md                   # Dedicated Use Case 1 documentation
│
├── Use Case 2 - Copilot/
│   ├── backend/
│   │   ├── copilot.py              # Groq LLM + Section 12 engine + normalizer
│   │   ├── retrieval.py            # Dual retrieval (Pandas + FAISS)
│   │   ├── rules_meta.py           # FR-01..FR-20 & CE-01..CE-05 metadata
│   │   ├── cache/                  # Precomputed FAISS index & embeddings
│   │   ├── main.py                 # FastAPI service (Port 8001)
│   │   ├── requirements.txt
│   │   ├── .env                    # Groq API configuration
│   │   └── run_backend.bat
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── globals.css     # Clean banking assistant styling
│   │   │   │   ├── layout.tsx      # Root layout
│   │   │   │   └── page.tsx        # Standalone Copilot Investigation Portal
│   │   │   ├── components/
│   │   │   │   ├── CopilotHeader.tsx # Header with model & engine metadata
│   │   │   │   ├── TransactionSpotlight.tsx # Transaction picker & telemetry
│   │   │   │   ├── CopilotChat.tsx # Prompt input & 1-click prompt chips
│   │   │   │   └── Section12Report.tsx # 7-part Section 12 investigation cards
│   │   │   ├── lib/
│   │   │   │   └── api.ts          # Client API calls to Port 8001
│   │   │   └── types/
│   │   │       └── index.ts        # Copilot TypeScript interfaces
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── next.config.ts
│   │   └── run_frontend.bat        # Port 3001 launcher
│   ├── run_copilot.bat             # 1-Click launcher for Use Case 2
│   └── README.md                   # Dedicated Use Case 2 documentation
│
└── shared/
    ├── data/
    │   └── RAWBANK_SENTIENT_KB.csv # Canonical Master Ground Truth Dataset
    └── docs/
        └── SYSTEM_ARCHITECTURE.md  # Comprehensive system flow & architecture
```
