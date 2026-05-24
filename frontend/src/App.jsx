import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, Code2, Terminal, ShieldAlert, BadgeAlert, Layers, Play, CheckCircle, 
  HelpCircle, Settings, Shield, RefreshCw, Cpu, Award, FileText, Check, Search, Globe
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';

// Color themes based on Agent Roles
const AGENT_THEMES = {
  "Product Manager": { color: "from-blue-500 to-indigo-500", border: "border-blue-500/30", text: "text-blue-400" },
  "Software Architect": { color: "from-purple-500 to-indigo-500", border: "border-purple-500/30", text: "text-purple-400" },
  "Backend Engineer": { color: "from-emerald-500 to-teal-500", border: "border-emerald-500/30", text: "text-emerald-400" },
  "Frontend Engineer": { color: "from-pink-500 to-rose-500", border: "border-pink-500/30", text: "text-pink-400" },
  "Reviewer": { color: "from-amber-500 to-orange-500", border: "border-amber-500/30", text: "text-amber-400" },
  "Security Engineer": { color: "from-red-500 to-rose-500", border: "border-red-500/30", text: "text-red-400" },
  "Test Engineer": { color: "from-cyan-500 to-blue-500", border: "border-cyan-500/30", text: "text-cyan-400" },
  "Debugging Agent": { color: "from-violet-500 to-fuchsia-500", border: "border-violet-500/30", text: "text-violet-400" },
  "DevOps Engineer": { color: "from-blue-600 to-cyan-500", border: "border-blue-600/30", text: "text-blue-400" },
  "Documentation Agent": { color: "from-emerald-600 to-emerald-400", border: "border-emerald-500/30", text: "text-emerald-300" }
};

const SAMPLE_PROJECTS = [
  { id: "1", name: "User Identity Microservice", desc: "FastAPI REST API with PostgreSQL backend and JWT authentication hooks." },
  { id: "2", name: "Stripe E-Commerce Core", desc: "Payment checkout routes, webhook consumers, database models, and security checks." },
  { id: "3", name: "Real-time Telemetry Service", desc: "WebSocket streaming server with Redis cache, memory optimization, and unit testing." }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('workspace');
  const [requirements, setRequirements] = useState(SAMPLE_PROJECTS[0].desc);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [activeNode, setActiveNode] = useState(null);
  const [completedNodes, setCompletedNodes] = useState([]);
  
  // Real-time feeds and logs
  const [logs, setLogs] = useState([]);
  const [generatedFiles, setGeneratedFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const selectedFileRef = useRef(null);
  
  // Metrics charts dynamic data
  const [metrics, setMetrics] = useState({
    qualityScore: 95,
    coverage: 92,
    executionTime: 12.8,
    failuresCount: 1
  });

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Premium Simulation Playback flow to mimic LangGraph orchestration perfectly
  const runSimulation = () => {
    setIsExecuting(true);
    setIsCompleted(false);
    setLogs([]);
    setCompletedNodes([]);
    setGeneratedFiles([]);
    setSelectedFile(null);
    selectedFileRef.current = null;
    
    const steps = [
      {
        id: "product_manager",
        role: "Product Manager",
        thought: "Ingesting core platform parameters. Extracting technical definitions. Drafting system Product Requirements Document (PRD).",
        output: "### Product Requirements Document (PRD)\n**Target**: Scalable REST microservice with token security.\n\n#### Features Required:\n- Secure user account creation routes.\n- Password encryption using BCrypt algorithm.\n- Persistent PostgreSQL data store integration.\n- Redis semantic speed storage.",
        duration: 2000
      },
      {
        id: "architect",
        role: "Software Architect",
        thought: "Creating architecture blueprint diagrams. Mapping database indices. Structuring MVC microservice files.",
        output: "### System Architecture Blueprint\n**Design Pattern**: Repository Pattern / Domain Driven Design\n\n#### Database Entities:\n- **User**: id (UUID), username (String), hashed_password (String), email (String)\n- **ActiveToken**: id (UUID), user_id (UUID), token (String), is_revoked (Boolean)\n\n#### File Layout:\n- `app/models.py` (SQLAlchemy mappings)\n- `app/schemas.py` (Pydantic validations)\n- `app/auth.py` (JWT & crypt keys)\n- `app/main.py` (FastAPI controller router)",
        duration: 2500,
        file: { path: "architecture_specs.md", type: "architecture", content: "### System Architecture Design\nPattern: Repository Layer Pattern\nFile: app/main.py\n\nEntities:\n- User Model\n- RefreshToken Model" }
      },
      {
        id: "code_generator",
        role: "Backend Engineer",
        thought: "Writing FastAPI endpoints, establishing PostgreSQL engines, creating router endpoints.",
        output: "# app/models.py\nimport uuid\nfrom datetime import datetime\nfrom sqlalchemy import Column, String, Boolean, DateTime\nfrom sqlalchemy.dialects.postgresql import UUID\nfrom sqlalchemy.ext.declarative import declarative_base\n\nBase = declarative_base()\n\nclass User(Base):\n    __tablename__ = 'users'\n    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)\n    username = Column(String, unique=True, index=True, nullable=False)\n    hashed_password = Column(String, nullable=False)\n    email = Column(String, unique=True, nullable=False)\n    is_active = Column(Boolean, default=True)\n    created_at = Column(DateTime, default=datetime.utcnow)",
        duration: 3000,
        file: { path: "models.py", type: "source_code", content: "# app/models.py\nimport uuid\nfrom datetime import datetime\nfrom sqlalchemy import Column, String, Boolean, DateTime\nfrom sqlalchemy.dialects.postgresql import UUID\nfrom sqlalchemy.ext.declarative import declarative_base\n\nBase = declarative_base()\n\nclass User(Base):\n    __tablename__ = 'users'\n    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)\n    username = Column(String, unique=True, index=True, nullable=False)\n    hashed_password = Column(String, nullable=False)\n    email = Column(String, unique=True, nullable=False)\n    is_active = Column(Boolean, default=True)\n    created_at = Column(DateTime, default=datetime.utcnow)" }
      },
      {
        id: "frontend",
        role: "Frontend Engineer",
        thought: "Creating responsive Tailwind components. Coding interactive charts and registration interface.",
        output: "// Dashboard.jsx\nimport React, { useState } from 'react';\n\nexport default function UserList() {\n  return (\n    <div className='bg-slate-900 border border-slate-800 rounded-xl p-6 glow-indigo'>\n      <h2 className='text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent'>\n        User Registry\n      </h2>\n    </div>\n  );\n}",
        duration: 2500,
        file: { path: "Dashboard.jsx", type: "source_code", content: "// Dashboard.jsx\nimport React, { useState } from 'react';\n\nexport default function UserList() {\n  return (\n    <div className='bg-slate-900 border border-slate-800 rounded-xl p-6 glow-indigo'>\n      <h2 className='text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent'>\n        User Registry\n      </h2>\n    </div>\n  );\n}" }
      },
      {
        id: "reviewer_fail",
        role: "Reviewer",
        thought: "Performing architectural compliance tests. Evaluating files against SOLID guidelines.",
        output: "Audit Complete. Score: 75. INCOMPLETE exception catching in user registration controller route. Requesting Debugger healing.",
        duration: 2000,
        score: 75
      },
      {
        id: "debugger",
        role: "Debugging Agent",
        thought: "Inspecting traceback. Refactoring routes to include defensive try/except bounds.",
        output: "# app/auth_fixed.py\n# Fixed exception wrapper inside controller endpoint\ntry:\n    user = register_user(db, payload)\nexcept DatabaseIntegrityException as de:\n    raise HTTPException(status_code=400, detail='Credential conflict')\nexcept Exception as e:\n    raise HTTPException(status_code=500, detail='Internal server error')",
        duration: 2500,
        file: { path: "auth_fixed.py", type: "source_code", content: "# app/auth_fixed.py\n# Fixed exception wrapper inside controller endpoint\ntry:\n    user = register_user(db, payload)\nexcept DatabaseIntegrityException as de:\n    raise HTTPException(status_code=400, detail='Credential conflict')\nexcept Exception as e:\n    raise HTTPException(status_code=500, detail='Internal server error')" }
      },
      {
        id: "reviewer_pass",
        role: "Reviewer",
        thought: "Auditing fixed source structures. Exception catches fully compliant. Code quality matches target specs.",
        output: "Audit Passed! Excellent refactoring score. Code Quality Score: 95/100.",
        duration: 1800,
        score: 95
      },
      {
        id: "security",
        role: "Security Engineer",
        thought: "Executing static security audits (SAST). Enforcing credential isolation rules.",
        output: "### Security Integrity Audit\n- [x] OWASP Vulnerability Check - Clean\n- [x] JWT Key Scope Integrity - Valid\n- [x] Input sanitization schema - Verified",
        duration: 2000
      },
      {
        id: "test_generator",
        role: "Test Engineer",
        thought: "Creating automated validation mock assertions. Generating Pytest files.",
        output: "# tests/test_auth.py\nimport pytest\nfrom fastapi.testclient import TestClient\n\ndef test_user_creation(client: TestClient):\n    response = client.post('/api/users', json={'username':'dev','email':'dev@dev.ai','password':'pass'})\n    assert response.status_code == 201",
        duration: 2000,
        file: { path: "test_auth.py", type: "test", content: "# tests/test_auth.py\nimport pytest\nfrom fastapi.testclient import TestClient\n\ndef test_user_creation(client: TestClient):\n    response = client.post('/api/users', json={'username':'dev','email':'dev@dev.ai','password':'pass'})\n    assert response.status_code == 201" }
      },
      {
        id: "sandbox_tester",
        role: "Test Engineer",
        thought: "Executing pytest suite inside Sandbox environment subprocess container.",
        output: "================== PASSES ==================\ntests/test_auth.py::test_user_creation PASSED\n\n1 passed in 0.07s\nPytest Code Coverage: 92%\nSandbox Exit Code: 0",
        duration: 2500
      },
      {
        id: "devops",
        role: "DevOps Engineer",
        thought: "Compiling environment variables, multi-stage Dockerfiles, and compose configurations.",
        output: "# Dockerfile\nFROM python:3.12-slim\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install -r requirements.txt\nCOPY . .\nEXPOSE 8000\nCMD ['uvicorn', 'app.main:app', '--host', '0.0.0.0']",
        duration: 2000,
        file: { path: "Dockerfile", type: "docker", content: "# Dockerfile\nFROM python:3.12-slim\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install -r requirements.txt\nCOPY . .\nEXPOSE 8000\nCMD ['uvicorn', 'app.main:app', '--host', '0.0.0.0']" }
      },
      {
        id: "documentation",
        role: "Documentation Agent",
        thought: "Writing production instructions, developer manuals, and endpoints contracts.",
        output: "# README.md\nAutonomous microservice compiled under AMASEP Multi-Agent collaborative network.\n\n## Launch\n`docker compose up --build`",
        duration: 1500,
        file: { path: "README.md", type: "documentation", content: "# README.md\nAutonomous microservice compiled under AMASEP Multi-Agent collaborative network.\n\n## Launch\n`docker compose up --build`" }
      }
    ];

    let currentStep = 0;
    
    const executeStep = () => {
      if (currentStep >= steps.length) {
        setIsExecuting(false);
        setIsCompleted(true);
        setActiveNode(null);
        return;
      }

      const step = steps[currentStep];
      setActiveNode(step.id);

      // Add to logs
      setLogs(prev => [...prev, {
        id: Math.random().toString(),
        role: step.role,
        thought: step.thought,
        output: step.output,
        timestamp: new Date().toLocaleTimeString()
      }]);

      if (step.file) {
        setGeneratedFiles(prev => {
          const updated = [...prev, step.file];
          // Use ref to avoid stale closure — only auto-select the very first file
          if (!selectedFileRef.current) {
            selectedFileRef.current = step.file;
            setSelectedFile(step.file);
          }
          return updated;
        });
      }

      if (step.score) {
        setMetrics(prev => ({ ...prev, qualityScore: step.score }));
      }

      setTimeout(() => {
        setCompletedNodes(prev => [...prev, step.id]);
        currentStep++;
        executeStep();
      }, step.duration);
    };

    executeStep();
  };

  // Recharts metric templates
  const performanceHistory = [
    { name: 'PM', score: 90, time: 2 },
    { name: 'Arch', score: 94, time: 4 },
    { name: 'Backend', score: 88, time: 7 },
    { name: 'QA', score: 95, time: 9 },
    { name: 'Security', score: 99, time: 11 },
    { name: 'Debugger', score: 95, time: 13 }
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* 1. TOP HEADER HEADER */}
      <header className="border-b border-slate-900 bg-slate-950/70 backdrop-blur-xl px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-indigo-600 to-cyan-500 rounded-xl shadow-glow-indigo">
            <Bot className="h-6 w-6 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-50 to-slate-200 bg-clip-text text-transparent">
              AMASEP
            </h1>
            <p className="text-xs text-indigo-400 font-semibold uppercase tracking-wider font-mono">
              Autonomous Software Engineering Platform
            </p>
          </div>
        </div>

        {/* Global Stats bar */}
        <div className="hidden lg:flex items-center gap-8 bg-slate-900/50 px-6 py-2 rounded-xl border border-slate-800/80">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-amber-400" />
            <span className="text-xs text-slate-400">Quality Score:</span>
            <span className="text-xs font-bold text-amber-400 font-mono">{metrics.qualityScore}%</span>
          </div>
          <div className="h-4 w-[1px] bg-slate-800" />
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-emerald-400" />
            <span className="text-xs text-slate-400">QA Coverage:</span>
            <span className="text-xs font-bold text-emerald-400 font-mono">{metrics.coverage}%</span>
          </div>
          <div className="h-4 w-[1px] bg-slate-800" />
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-cyan-400" />
            <span className="text-xs text-slate-400">Docker Status:</span>
            <span className="text-xs font-bold text-cyan-400 font-mono uppercase">Optimal</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setActiveTab('workspace')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'workspace' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:text-slate-100'}`}
          >
            Agent Workspace
          </button>
          <button 
            onClick={() => setActiveTab('files')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'files' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:text-slate-100'}`}
          >
            Code Explorer ({generatedFiles.length})
          </button>
          <button 
            onClick={() => setActiveTab('metrics')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'metrics' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:text-slate-100'}`}
          >
            Analytics
          </button>
        </div>
      </header>

      {/* 2. BODY WORKSPACE */}
      <main className="flex-1 p-8 grid grid-cols-1 xl:grid-cols-12 gap-8 max-w-[1700px] w-full mx-auto">
        
        {activeTab === 'workspace' && (
          <>
            {/* LEFT CONTROL AND GRAPH: 5 cols */}
            <div className="xl:col-span-5 flex flex-col gap-8">
              
              {/* Requirements & Action Panel */}
              <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 shadow-2xl flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                    <Layers className="h-5 w-5 text-indigo-400" />
                    Configure Software Specs
                  </h3>
                  {isExecuting ? (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full">
                      <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                      <span className="text-[10px] font-bold text-amber-400 font-mono uppercase">Running Agents...</span>
                    </div>
                  ) : isCompleted ? (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
                      <CheckCircle className="h-3 w-3 text-emerald-400" />
                      <span className="text-[10px] font-bold text-emerald-400 font-mono uppercase">Pipeline Complete</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                      <span className="h-2 w-2 rounded-full bg-indigo-400 animate-ping" />
                      <span className="text-[10px] font-bold text-indigo-400 font-mono uppercase">Simulation Ready</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-400 font-semibold">Select Requirements Archetype</label>
                  <div className="grid grid-cols-3 gap-2">
                    {SAMPLE_PROJECTS.map((proj) => (
                      <button
                        key={proj.id}
                        onClick={() => setRequirements(proj.desc)}
                        className={`text-left p-2.5 rounded-lg border text-xs transition ${requirements === proj.desc ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-200' : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 text-slate-400'}`}
                      >
                        <span className="font-semibold block truncate">{proj.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-400 font-semibold">Specify Requirements / Prompt</label>
                  <textarea
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    rows={4}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition font-sans resize-none"
                    placeholder="Describe the application features, REST endpoints, and architectural frameworks you want designed..."
                  />
                </div>

                <button
                  onClick={runSimulation}
                  disabled={isExecuting}
                  className={`w-full py-4 rounded-xl font-bold text-sm tracking-wide transition flex items-center justify-center gap-2 shadow-lg ${
                    isExecuting
                      ? 'bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 text-white hover:opacity-90 shadow-glow-indigo active:scale-[0.98]'
                  }`}
                >
                  {isExecuting ? (
                    <><RefreshCw className="h-4 w-4 animate-spin" /> AGENTS COLLABORATING...</>
                  ) : (
                    <><Play className="h-4 w-4 fill-white text-white" /> {isCompleted ? 'RERUN COLLABORATIVE AGENTS' : 'LAUNCH COLLABORATIVE AGENTS'}</>
                  )}
                </button>

                {/* Completion Banner */}
                {isCompleted && (
                  <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-emerald-300">Pipeline completed successfully!</p>
                      <p className="text-xs text-emerald-400/70 mt-0.5">10 agents collaborated — {generatedFiles.length} files generated. Review them in the <button onClick={() => setActiveTab('files')} className="underline hover:text-emerald-300">Code Explorer</button> tab.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* LangGraph Visualizer Panel */}
              <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 shadow-2xl flex-1 flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-slate-900 pb-4">
                  <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                    <Globe className="h-5 w-5 text-indigo-400" />
                    LangGraph Workflow Node Visualizer
                  </h3>
                  <span className="text-xs text-slate-500 font-semibold font-mono">10 Multi-Agents Active</span>
                </div>

                {/* Graph Layout Grid */}
                <div className="grid grid-cols-2 gap-4 flex-1 items-center content-center py-4">
                  {[
                    { id: "product_manager", name: "1. Requirements Node", role: "Product Manager" },
                    { id: "architect", name: "2. Architecture Node", role: "Software Architect" },
                    { id: "code_generator", name: "3. Backend Engineer", role: "Backend Engineer" },
                    { id: "frontend", name: "4. Frontend Engineer", role: "Frontend Engineer" },
                    { id: "reviewer_fail", name: "5. Code Reviewer", role: "Reviewer" },
                    { id: "debugger", name: "6. Debugger Node", role: "Debugging Agent" },
                    { id: "reviewer_pass", name: "7. Integrity Review", role: "Reviewer" },
                    { id: "security", name: "8. Security Audit", role: "Security Engineer" },
                    { id: "test_generator", name: "9. Test Generation", role: "Test Engineer" },
                    { id: "sandbox_tester", name: "10. Sandbox execution", role: "Test Engineer" },
                    { id: "devops", name: "11. DevOps Node", role: "DevOps Engineer" },
                    { id: "documentation", name: "12. Docs Node", role: "Documentation Agent" }
                  ].map((node) => {
                    const isActive = activeNode === node.id;
                    const isCompleted = completedNodes.includes(node.id);
                    const theme = AGENT_THEMES[node.role] || { color: "from-slate-500 to-slate-600", text: "text-slate-400" };
                    
                    return (
                      <div
                        key={node.id}
                        className={`p-3.5 rounded-xl border transition-all duration-300 relative overflow-hidden flex flex-col gap-1.5 ${isActive ? 'bg-slate-900/90 border-indigo-500 glow-indigo shadow-lg scale-[1.02]' : isCompleted ? 'bg-slate-900/40 border-emerald-500/30' : 'bg-slate-900/10 border-slate-900/80 opacity-40'}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] uppercase font-mono font-extrabold tracking-wider ${isActive ? theme.text : isCompleted ? 'text-emerald-400' : 'text-slate-500'}`}>
                            {node.role}
                          </span>
                          {isCompleted && <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />}
                          {isActive && <span className="h-2 w-2 rounded-full bg-indigo-400 animate-ping" />}
                        </div>
                        <span className={`text-xs font-bold font-sans ${isActive ? 'text-slate-100' : isCompleted ? 'text-slate-300' : 'text-slate-600'}`}>
                          {node.name}
                        </span>

                        {/* Top Gradient Active Border indicator */}
                        {isActive && (
                          <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${theme.color}`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* RIGHT AGENT THOUGHTS AND CHAT LOGS: 7 cols */}
            <div className="xl:col-span-7 flex flex-col glass-panel rounded-2xl border border-slate-800/80 shadow-2xl h-[820px] overflow-hidden">
              {/* Console header */}
              <div className="bg-slate-900/70 border-b border-slate-900 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs text-slate-400 font-mono font-semibold ml-2 flex items-center gap-1.5">
                    <Terminal className="h-3.5 w-3.5 text-indigo-400" />
                    amasep_langgraph_stream_output: ~
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-slate-800 border border-slate-700/50 rounded text-[10px] text-slate-400 font-mono">
                    WS: active
                  </span>
                </div>
              </div>

              {/* Live console message lists */}
              <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-6">
                {logs.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-20">
                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-full">
                      <Cpu className="h-10 w-10 text-slate-700 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-slate-300 font-bold">Idle State - Waiting for trigger</h4>
                      <p className="text-xs text-slate-500 max-w-sm mt-1 mx-auto leading-relaxed">
                        Configure project requirements in the spec console and launch workflow to initiate 10 engineering agents executing in a self-healing retry pipeline.
                      </p>
                    </div>
                  </div>
                ) : (
                  logs.map((log) => {
                    const theme = AGENT_THEMES[log.role] || { color: "from-slate-500 to-slate-600", text: "text-slate-400" };
                    return (
                      <div key={log.id} className="flex flex-col gap-3 group">
                        {/* Agent Identifier Header */}
                        <div className="flex items-center gap-3">
                          <div className={`h-8 w-8 rounded-lg bg-gradient-to-tr ${theme.color} flex items-center justify-center text-white font-extrabold text-xs shadow-md`}>
                            {log.role[0]}
                          </div>
                          <div>
                            <span className="text-sm font-bold text-slate-200">{log.role}</span>
                            <span className="text-[10px] text-slate-500 ml-2 font-mono">{log.timestamp}</span>
                          </div>
                        </div>

                        {/* Agent Core thoughts */}
                        <div className="pl-11 pr-4">
                          <div className="bg-slate-900/60 border border-slate-900 rounded-xl p-4 text-xs text-indigo-200/90 leading-relaxed font-semibold italic">
                            💡 Thought: {log.thought}
                          </div>
                        </div>

                        {/* Generated structural outputs/code blocks */}
                        <div className="pl-11 pr-4">
                          <div className="bg-slate-950 border border-slate-900 rounded-xl p-4 font-mono text-xs overflow-x-auto text-slate-300 max-h-[300px] leading-relaxed shadow-inner">
                            <pre className="whitespace-pre-wrap">{log.output}</pre>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={chatEndRef} />
              </div>
            </div>
          </>
        )}

        {/* 3. CODE EXPLORER TAB */}
        {activeTab === 'files' && (
          <div className="xl:col-span-12 glass-panel rounded-2xl border border-slate-800/80 p-8 shadow-2xl flex flex-col gap-6 min-h-[700px]">
            <div className="flex items-center justify-between border-b border-slate-900 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Code2 className="h-5 w-5 text-indigo-400" />
                  Code Explorer Workspace
                </h3>
                <p className="text-xs text-slate-500 mt-1">Review raw architecture specs, generated FastAPI model codes, test packages, and Docker configs built by collaborative agents.</p>
              </div>
            </div>

            {generatedFiles.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-20">
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-full">
                  <FileText className="h-8 w-8 text-slate-700" />
                </div>
                <div>
                  <h4 className="text-slate-400 font-bold">No generated files yet</h4>
                  <p className="text-xs text-slate-600 mt-1">Launch the agent workflow simulation in workspace to generate structural source code files.</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1">
                {/* File selectors sidebar */}
                <div className="lg:col-span-1 flex flex-col gap-2">
                  {generatedFiles.map((file) => (
                    <button
                      key={file.path}
                      onClick={() => setSelectedFile(file)}
                      className={`w-full text-left p-3.5 rounded-xl border transition flex items-center justify-between ${selectedFile?.path === file.path ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-300' : 'bg-slate-900/40 border-slate-900 hover:border-slate-800 text-slate-400'}`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <FileText className="h-4 w-4 shrink-0 text-indigo-400" />
                        <span className="text-xs font-mono font-semibold truncate">{file.path}</span>
                      </div>
                      <span className="px-2 py-0.5 bg-slate-900 border border-slate-800/80 rounded text-[9px] uppercase tracking-wider font-semibold text-slate-500">
                        {file.type}
                      </span>
                    </button>
                  ))}
                </div>

                {/* File editor details viewer */}
                <div className="lg:col-span-3 bg-slate-950 border border-slate-900 rounded-2xl p-6 font-mono text-xs overflow-auto flex flex-col gap-4 shadow-inner max-h-[600px]">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                    <span className="text-slate-400 font-mono font-bold flex items-center gap-1.5">
                      <Terminal className="h-4 w-4 text-indigo-400" />
                      {selectedFile?.path || "untitled.txt"}
                    </span>
                    <span className="px-2.5 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded text-[10px] text-indigo-400 font-semibold uppercase tracking-wider font-sans">
                      Syntactical Visualizer Active
                    </span>
                  </div>
                  <pre className="whitespace-pre text-slate-300 leading-relaxed overflow-x-auto select-text">
                    {selectedFile?.content || "// Click a file in the workspace to view contents."}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4. PERFORMANCE ANALYTICS TAB */}
        {activeTab === 'metrics' && (
          <div className="xl:col-span-12 flex flex-col gap-8">
            
            {/* Highlights count */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { name: "Global Quality Index", value: `${metrics.qualityScore}%`, icon: Award, color: "text-amber-400" },
                { name: "Pytest Test Coverage", value: `${metrics.coverage}%`, icon: Shield, color: "text-emerald-400" },
                { name: "Total Gen Duration", value: `${metrics.executionTime}s`, icon: Cpu, color: "text-cyan-400" },
                { name: "Defect Heal Cycles", value: metrics.failuresCount, icon: RefreshCw, color: "text-rose-400" }
              ].map((item) => (
                <div key={item.name} className="glass-panel border border-slate-800/80 rounded-2xl p-6 flex items-center justify-between shadow-2xl">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{item.name}</span>
                    <span className="text-2xl font-black text-slate-100 font-mono">{item.value}</span>
                  </div>
                  <div className={`p-3 bg-slate-900 border border-slate-800 rounded-xl`}>
                    <item.icon className={`h-5 w-5 ${item.color}`} />
                  </div>
                </div>
              ))}
            </div>

            {/* Graphs panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Coverage Chart */}
              <div className="glass-panel border border-slate-800/80 rounded-2xl p-6 flex flex-col gap-4 shadow-2xl">
                <h4 className="text-sm font-bold text-slate-300">Sandbox Test Coverage Curve</h4>
                <div className="h-[250px] w-full mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={performanceHistory}>
                      <defs>
                        <linearGradient id="colorCover" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                      <YAxis stroke="#64748b" fontSize={10} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                      <Area type="monotone" dataKey="score" stroke="#06b6d4" fillOpacity={1} fill="url(#colorCover)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Time Chart */}
              <div className="glass-panel border border-slate-800/80 rounded-2xl p-6 flex flex-col gap-4 shadow-2xl">
                <h4 className="text-sm font-bold text-slate-300">Agent Performance Generation Speeds (s)</h4>
                <div className="h-[250px] w-full mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceHistory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                      <YAxis stroke="#64748b" fontSize={10} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                      <Bar dataKey="time" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* Footer bar */}
      <footer className="border-t border-slate-900 bg-slate-950/80 px-8 py-5 text-center text-xs text-slate-500 font-mono">
        Autonomous Multi-Agent Software Engineering Platform (AMASEP) © 2026. Made with ❤️ for top-tier portfolios.
      </footer>
    </div>
  );
}
