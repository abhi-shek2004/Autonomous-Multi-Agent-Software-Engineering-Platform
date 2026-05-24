<div align="center">

<img src="https://img.shields.io/badge/Python-3.12-blue?style=for-the-badge&logo=python&logoColor=white" />
<img src="https://img.shields.io/badge/FastAPI-0.110-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
<img src="https://img.shields.io/badge/LangGraph-Orchestrated-blueviolet?style=for-the-badge" />
<img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
<img src="https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
<img src="https://img.shields.io/badge/Redis-Celery-DC382D?style=for-the-badge&logo=redis&logoColor=white" />
<img src="https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql&logoColor=white" />
<img src="https://img.shields.io/badge/FAISS-Vector_DB-orange?style=for-the-badge" />
<img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" />

# 🤖 AMASEP
## Autonomous Multi-Agent Software Engineering Platform

> *An enterprise-grade AI platform where 10 specialized agents collaborate in a self-healing LangGraph pipeline to autonomously design, build, review, test, debug, and deploy software.*

**Built for top-tier AI/ML engineering portfolios — internship-ready for OpenAI, Anthropic, Google, and Microsoft.**

</div>

---

## 🎯 What Is AMASEP?

AMASEP is a production-grade autonomous software engineering platform powered by a **LangGraph state machine** orchestrating a collaborative team of **10 specialized AI agents**. Given a plain-English software requirement, the platform autonomously:

1. 📋 **Analyzes requirements** → writes a full PRD
2. 🏗️ **Designs system architecture** → generates DB schema and folder structure
3. 💻 **Writes backend (FastAPI) + frontend (React) code**
4. 🔍 **Reviews code** → scores quality, flags failures
5. 🛡️ **Audits security** → OWASP compliance checking
6. 🧪 **Generates & executes tests** → runs pytest in an isolated sandbox
7. 🔧 **Self-heals failures** → Debugging Agent rewrites broken code automatically
8. 🐳 **Generates Docker infrastructure**
9. 📖 **Writes documentation** → README, API contracts
10. 🔁 **Loops back** → retry until code quality score ≥ 80

---

## ✨ Core Features

| Feature | Description |
|---|---|
| 🧠 **LangGraph Orchestration** | 10-node state machine with conditional edges, self-healing retry loops |
| 🤖 **10 Specialized Agents** | PM, Architect, Backend, Frontend, Reviewer, Security, Test, Debugger, DevOps, Docs |
| 🔄 **Dual Execution Mode** | Real OpenAI GPT-4o calls **or** instant offline Premium Simulation |
| 📦 **FAISS RAG Engine** | AST-level code indexing with semantic search and OpenAI embeddings fallback |
| 🔐 **JWT Authentication** | Role-based access control (developer / admin / architect) |
| ⚡ **Celery + Redis Queues** | Distributed async background task execution |
| 🌐 **WebSocket Streaming** | Real-time agent log streaming to the dashboard |
| 🐳 **Full Docker Stack** | One-command launch: `docker compose up --build` |
| 📊 **Prometheus + Grafana** | Live system metrics, agent performance dashboards |
| 🧪 **Isolated Sandbox** | Subprocess-based pytest execution with 15s timeout |

---

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                   React Dashboard (Port 3000)                │
│   Live Node Graph │ Agent Logs │ Code Explorer │ Analytics   │
└──────────────────────────┬───────────────────────────────────┘
                           │ HTTP + WebSockets
┌──────────────────────────▼───────────────────────────────────┐
│              FastAPI API Gateway (Port 8000)                 │
│         JWT Auth │ Rate Limiting │ RBAC │ CORS               │
└────┬────────────────────┬──────────────────────┬─────────────┘
     │                    │                      │
┌────▼────────┐  ┌────────▼──────────┐  ┌───────▼──────────────┐
│  PostgreSQL  │  │ Agent Orchestrator│  │   RAG Service        │
│  Database   │  │   (Port 8001)     │  │   (Port 8002)        │
│             │  │ LangGraph Engine  │  │ FAISS + OpenAI Embed │
└─────────────┘  │ CrewAI Agents     │  └──────────────────────┘
                 │ WebSocket Manager │
                 └────────┬──────────┘
                          │
          ┌───────────────┼────────────────┐
          │               │                │
   ┌──────▼──────┐ ┌──────▼──────┐ ┌──────▼──────┐
   │    Redis    │ │   Celery    │ │  Sandbox    │
   │  (Cache +  │ │  Workers    │ │ (Port 8003) │
   │   Broker)  │ │             │ │  Safe Exec  │
   └─────────────┘ └─────────────┘ └─────────────┘
          │
   ┌──────▼──────────────────┐
   │  Prometheus (Port 9090) │
   │  Grafana    (Port 3001) │
   └─────────────────────────┘
```

---

## 🔄 Agent Workflow (LangGraph State Machine)

```
Requirements Input
       │
       ▼
[1] Product Manager ──────────────────────── PRD Document
       │
       ▼
[2] Software Architect ────────────────────── Architecture Blueprint
       │
       ▼
[3] Backend Engineer ──────────────────────── FastAPI Source Code
[4] Frontend Engineer ─────────────────────── React Components
       │
       ▼
[5] Code Reviewer ─── score < 80 ──────────► [6] Debugging Agent ─┐
       │                                                            │
       │ score ≥ 80                                                │
       │◄───────────────────────────────────────────────────────── ┘
       ▼
[7] Security Engineer ─────────────────────── OWASP Audit Report
       │
       ▼
[8] Test Engineer ─────────────────────────── pytest Suites
       │
       ▼
[9] Sandbox Executor ── fail ───────────────► [6] Debugging Agent ─┐
       │                                                            │
       │ pass                                                       │
       │◄───────────────────────────────────────────────────────── ┘
       ▼
[10] DevOps Engineer ──────────────────────── Dockerfile + Compose
       │
       ▼
[11] Documentation Agent ──────────────────── README + API Docs
       │
       ▼
  ✅ COMPLETE
```

---

## 📁 Project Structure

```
Autonomous-Multi-Agent-Software-Engineering-Platform/
│
├── backend/
│   ├── api_gateway/
│   │   ├── main.py          # FastAPI gateway: auth, projects, workflows, rate limiting
│   │   └── auth.py          # JWT tokens, bcrypt hashing, RBAC
│   │
│   ├── orchestrator/
│   │   ├── main.py          # REST trigger + WebSocket streaming endpoint
│   │   ├── graph.py         # LangGraph StateGraph — 10 nodes + conditional edges
│   │   ├── agents.py        # 10 agent definitions (OpenAI + Simulation modes)
│   │   └── sockets.py       # WebSocket connection manager
│   │
│   ├── rag_service/
│   │   ├── main.py          # Ingest + search endpoints
│   │   ├── indexer.py       # AST parser + directory crawler
│   │   └── vector_store.py  # FAISS + OpenAI embeddings (with offline fallback)
│   │
│   ├── sandbox/
│   │   ├── main.py          # Sandbox REST endpoints
│   │   └── executor.py      # Isolated subprocess pytest runner (15s timeout)
│   │
│   ├── common/
│   │   ├── models.py        # SQLAlchemy: User, Project, Workflow, Task, File, Metric
│   │   ├── schemas.py       # Pydantic request/response DTOs
│   │   └── config.py        # Pydantic Settings: env vars, DB URL, secrets
│   │
│   ├── celery_app.py        # Celery + Redis broker config
│   ├── tasks_celery.py      # Async task bridge (Celery → asyncio LangGraph)
│   ├── Dockerfile           # Multi-stage Python 3.12 builder
│   └── requirements.txt     # All Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main dashboard: 3 tabs, live simulation, charts
│   │   ├── index.css        # Glassmorphism, glow effects, custom scrollbars
│   │   └── main.jsx         # React 18 root mount
│   │
│   ├── index.html           # HTML entry (Google Fonts: Inter + Outfit)
│   ├── tailwind.config.js   # Custom dark theme + glow shadows
│   ├── postcss.config.js    # PostCSS + autoprefixer
│   ├── vite.config.js       # Vite dev server (port 3000)
│   ├── package.json         # React 18, Recharts, Lucide, Tailwind
│   └── Dockerfile           # Node 20 Alpine dev container
│
├── docker/
│   └── prometheus/
│       └── prometheus.yml   # Scrape config for gateway + orchestrator
│
├── tests/
│   ├── test_gateway.py      # JWT signing, password hashing, health checks
│   └── test_rag.py          # FAISS indexing, AST parsing, semantic search
│
├── docker-compose.yml       # Full 10-container orchestration
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start

### Option A — Docker Compose (One Command)

```bash
# Clone the repo
git clone https://github.com/abhi-shek2004/Autonomous-Multi-Agent-Software-Engineering-Platform.git
cd Autonomous-Multi-Agent-Software-Engineering-Platform

# (Optional) Set your OpenAI API key for real LLM mode
# Without it, the platform runs in Premium Simulation Mode automatically
export OPENAI_API_KEY=your-key-here

# Launch everything
docker compose up --build
```

| Service | URL |
|---|---|
| 🖥️ **React Dashboard** | http://localhost:3000 |
| ⚡ **API Gateway + Swagger** | http://localhost:8000/docs |
| 🤖 **Agent Orchestrator** | http://localhost:8001 |
| 🔍 **RAG Service** | http://localhost:8002 |
| 🐳 **Sandbox Executor** | http://localhost:8003 |
| 📊 **Prometheus** | http://localhost:9090 |
| 📈 **Grafana** | http://localhost:3001 (admin/admin) |

---

### Option B — Local Development

#### 1. Backend Services

```bash
# Create virtual environment
python3 -m venv venv && source venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt

# Set environment (PostgreSQL + Redis must be running locally)
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/amasep"
export REDIS_URL="redis://localhost:6379/0"
export OPENAI_API_KEY="your-key"   # optional — simulation mode if omitted
export SIMULATION_MODE="true"       # force simulation mode regardless

# Start each service in a separate terminal
uvicorn backend.api_gateway.main:app --port 8000 --reload
uvicorn backend.orchestrator.main:app --port 8001 --reload
uvicorn backend.rag_service.main:app --port 8002 --reload
uvicorn backend.sandbox.main:app --port 8003 --reload

# Start Celery worker (optional — direct async fallback used if unavailable)
celery -A backend.celery_app.celery_app worker --loglevel=info
```

#### 2. Frontend Dashboard

```bash
cd frontend
npm install
npm run dev
# Open http://localhost:3000
```

#### 3. Run Tests

```bash
# From project root
PYTHONPATH=. pytest tests/ -v
```

---

## 🎬 Demo Walkthrough

1. Open **http://localhost:3000**
2. Select a project archetype or write your own requirements
3. Click **"LAUNCH COLLABORATIVE AGENTS"**
4. Watch the **LangGraph node grid** — each node glows and pulses as its agent executes
5. Read **live agent thoughts and code** streaming in the terminal console
6. The **Reviewer agent intentionally fails** the first pass (score: 75) → **Debugger self-heals** → Reviewer re-approves (score: 95)
7. After completion, click **Code Explorer** to browse all generated files
8. Visit **Analytics** tab to see quality/coverage charts update live

---

## 🔑 Environment Variables

| Variable | Default | Description |
|---|---|---|
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/amasep` | PostgreSQL connection |
| `REDIS_URL` | `redis://localhost:6379/0` | Redis broker + cache |
| `JWT_SECRET` | `super-secret-...` | JWT signing key (change in production!) |
| `OPENAI_API_KEY` | `""` | OpenAI API key — leave empty for simulation |
| `SIMULATION_MODE` | `true` | Force simulation mode (`true`/`false`) |

---

## 🧠 Dual Execution Mode

| Mode | Trigger | Behavior |
|---|---|---|
| **🤖 OpenAI Live** | `OPENAI_API_KEY` set + `SIMULATION_MODE=false` | Real GPT-4o-mini completions for all agent outputs |
| **⚡ Simulation** | No API key or `SIMULATION_MODE=true` | Pre-authored high-fidelity agent outputs with full state machine execution including self-healing loop |

---

## 🗄️ Database Schema

```
users          → id, username, hashed_password, role, created_at
projects       → id, name, description, github_url, status, created_at
workflows      → id, project_id, status, current_step, graph_state, started_at, completed_at
agent_tasks    → id, workflow_id, agent_role, task_description, status, output, quality_score
generated_files→ id, workflow_id, file_path, file_content, file_type, created_at
metrics        → id, workflow_id, metric_name, metric_value, recorded_at
```

---

## 🛡️ Security Features

- ✅ JWT HS256 authentication with 24-hour token expiry
- ✅ Bcrypt password hashing (salted)
- ✅ Role-Based Access Control (developer / admin / architect)
- ✅ Redis-backed rate limiting (60 req/min per IP)
- ✅ CORS middleware configuration
- ✅ Pydantic input validation on all endpoints
- ✅ Subprocess sandboxing with 15s execution timeout

---

## 📊 Tech Stack

| Layer | Technology |
|---|---|
| **Language** | Python 3.12, JavaScript (ES2024) |
| **Backend Framework** | FastAPI 0.110 |
| **AI Orchestration** | LangGraph, CrewAI |
| **LLM** | OpenAI GPT-4o-mini (text-embedding-3-small for RAG) |
| **Vector DB** | FAISS (with TF-IDF offline fallback) |
| **Task Queue** | Celery 5.3 + Redis |
| **Database** | PostgreSQL 16 + SQLAlchemy 2.0 |
| **Authentication** | JWT (PyJWT) + Bcrypt |
| **Frontend** | React 18 + Vite 5 |
| **Styling** | Tailwind CSS 3 + custom glassmorphism |
| **Charts** | Recharts 2 |
| **Icons** | Lucide React |
| **Real-time** | WebSockets (native FastAPI) |
| **Containerization** | Docker + Docker Compose |
| **Monitoring** | Prometheus + Grafana |
| **Testing** | Pytest 8 + FastAPI TestClient |

---

## 🤝 Contributing

1. Fork this repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'feat: add my feature'`
4. Push the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — free to use, modify and distribute.

---

<div align="center">

**Built with ❤️ for top-tier AI engineering portfolios**

*Designed to demonstrate advanced multi-agent systems, production-grade FastAPI architecture, and modern React dashboards*

⭐ **Star this repo if it helped your portfolio!** ⭐

</div>
