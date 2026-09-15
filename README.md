# NyayaMitra (न्यायमित्र) — AI for Legal Assistance & Access

[![NyayaMitra CI](https://github.com/nyayamitra/nyayamitra/actions/workflows/ci.yml/badge.svg)](https://github.com/nyayamitra/nyayamitra/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python: 3.11+](https://img.shields.io/badge/Python-3.11%2B-blue.svg)](backend/pyproject.toml)
[![Next.js: 14](https://img.shields.io/badge/Next.js-14-black.svg)](frontend/package.json)
[![WCAG: 2.1 AA](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-success.svg)](docs/PRD.md)
[![Zero Fabricated Citations](https://img.shields.io/badge/Evaluations-Zero%20Fabricated%20Citations-gold.svg)](evals/)

> **NyayaMitra** is a citizen-first, Generative-AI-powered legal assistance and access platform designed for India. Grounded strictly in verified Tier-1 Indian statutes (incorporating the 2024 **Bharatiya Nyaya Sanhita**, **Bharatiya Nagarik Suraksha Sanhita**, and **Bharatiya Sakshya Adhiniyam**), NyayaMitra helps ordinary people understand their legal rights in plain language (Hindi & English), calculate deadlines, draft dispute documents, and access free legal aid.

---

## 🏛️ Key Capabilities & User Experience

NyayaMitra is built around three core citizen jobs and an active trust layer:

```text
┌──────────────────────────────────────────────────────────────────────────────────┐
│                             CITIZEN LEGAL JOURNEY                                │
└──────────────────────────────────────────────────────────────────────────────────┘
        │
        ▼
[ 1. Samjho Mera Problem ] ───► Plain-language or spoken intake (Hindi / English)
                                Summarizes facts, clarifies ambiguities, detects domain.
        │
        ▼
[ 2. Mere Adhikaar ]       ───► Explains legal rights at Grade 6–8 reading level.
                                Verified Tier-1 citations (India Code) & action timeline.
        │
        ▼
[ 3. Mera Document ]       ───► Generates deterministic, reviewable legal documents
                                (RTI Applications, Consumer Grievances, Tenant Replies).
        │
        ▼
[ Human Escalation Layer ] ───► Automatic handoff to NALSA (15100), Tele-Law, or local
                                DLSA whenever matters are high-risk or require an advocate.
```

---

## 🛡️ Core Engineering Principles

1. **Source Before Model**: The LLM is never the source of legal truth. Citations are grounded in versioned, hashed Tier-1 statutory records (India Code, Official Gazettes, NALSA).
2. **Current-Law Primacy (2024 Transition)**: Enforces current criminal enactments (**BNS 2023**, **BNSS 2023**, **BSA 2023**). Prohibits presenting repealed colonial acts (IPC, CrPC, IEA) as current law.
3. **Strict AI Safety Boundaries**: Explicit disclaimers on every view. External documents and uploads are treated as untrusted data to eliminate prompt-injection vulnerabilities.
4. **Data Privacy (DPDPA 2023)**: Zero raw PII in application logs; ephemeral 24-hour TTL file storage.
5. **Universal Accessibility**: Mobile-first responsive UI compliant with **WCAG 2.1 AA** guidelines, voice input capabilities, and low-bandwidth optimization.

---

## 🏗️ Architecture & Monorepo Layout

```text
Legal-Assistance-Access/
├── .github/workflows/          # GitHub Actions CI pipeline
├── backend/                    # FastAPI backend
│   ├── app/
│   │   ├── core/               # App configuration & dependency injection
│   │   ├── middleware/         # Structured logging, PII redaction, security headers
│   │   ├── models/             # SQLAlchemy / Pydantic domain models
│   │   ├── repositories/       # Data access abstractions
│   │   ├── routers/            # Thin API routes (/api/v1/health, etc.)
│   │   ├── services/           # Core legal business logic
│   │   ├── sources/            # Tier 1/2/3 legal data connectors & adapters
│   │   └── utils/              # Deterministic utilities
│   ├── tests/                  # Backend pytest suite
│   ├── pyproject.toml          # Ruff, Mypy & Pytest configuration
│   └── requirements.txt        # Backend dependencies
├── frontend/                   # Next.js 14 App Router client
│   ├── app/                    # Accessible pages & layout
│   ├── components/             # Reusable UI components
│   ├── package.json            # Frontend dependencies
│   └── Dockerfile              # Production container build
├── docs/                       # Project architecture, PRD & governance
│   ├── PRD.md                  # Complete Product Requirements Document
│   ├── SOURCE_POLICY.md        # Source tiers, freshness & BNS transition rules
│   ├── SAFETY_POLICY.md        # Safety guardrails, disclaimers & escalation
│   └── phases/                 # Phase completion reports
├── tests/                      # End-to-end integration & phase tests
├── .env.example                # Canonical environment template
├── .gitleaks.toml              # Secret scanning configuration
├── docker-compose.yml          # Local container orchestration
├── SECURITY.md                 # Vulnerability reporting guidelines
└── LICENSE                     # MIT Open Source License
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- **Python:** 3.11 or higher
- **Node.js:** 18 or higher (v20+ recommended)
- **Git**

### 1. Clone & Configure
```bash
git clone https://github.com/nyayamitra/nyayamitra.git
cd nyayamitra
cp .env.example .env
```

### 2. Backend Setup
```bash
# Create and activate virtual environment
python -m venv .venv
# On Windows:
.\.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt

# Run backend test suite
pytest backend/tests/

# Start FastAPI server
uvicorn app.main:app --app-dir backend --reload --port 8000
```
API Documentation will be available at: [http://localhost:8000/docs](http://localhost:8000/docs)  
Health Endpoint: [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health)

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Client Application will be running at: [http://localhost:3000](http://localhost:3000)

### 4. Full-Stack with Docker Compose
```bash
docker-compose up --build
```

---

## 🧪 Testing & Quality Gates

Run all automated verification gates:
```bash
# Backend linting & type checks
ruff check backend/
mypy backend/app/

# Backend tests with coverage
pytest --cov=app backend/tests/

# Phase 0 validation check
python tests/test_phase_0.py

# Frontend type check & lint
cd frontend && npm run type-check && npm run lint
```

---

## 📜 Legal Disclaimer
NyayaMitra provides legal information and automated procedural assistance based on publicly accessible Indian statutes. It **does not** provide formal legal advice or legal representation. For critical legal proceedings, users should consult an enrolled advocate or reach out to the **National Legal Services Authority (NALSA)** toll-free helpline at **15100**.
