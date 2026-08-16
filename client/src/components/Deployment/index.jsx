import React, { useState } from "react";
import "./index.css";

const Deployment = () => {
  const [copiedKey, setCopiedKey] = useState(null);

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const frontendConfig = [
    { label: "Platform", value: "Cloudflare Pages" },
    { label: "Project Name", value: "resume-ats-ai", copyable: true },
    { label: "Production URL", value: "https://resume-ats-ai.pages.dev", copyable: true, link: true },
    { label: "Root Directory", value: "client", copyable: true },
    { label: "Build Command", value: "npm run build", copyable: true },
    { label: "Output Directory", value: "dist", copyable: true },
    { label: "Production Branch", value: "main", copyable: true },
  ];

  const backendConfig = [
    { label: "Platform", value: "Render Web Service" },
    { label: "Production URL", value: "https://resumeats-ai.onrender.com", copyable: true, link: true },
    { label: "Root Directory", value: "server", copyable: true },
    { label: "Build Command", value: "npm install", copyable: true },
    { label: "Start Command", value: "npm start", copyable: true },
    { label: "Environment", value: "Production" },
  ];

  const envVariables = [
    { name: "VITE_API_BASE_URL", scope: "Frontend", sample: "https://resumeats-ai.onrender.com", desc: "Production Express backend API base URL" },
    { name: "PORT", scope: "Backend", sample: "5000", desc: "Express HTTP server listening port" },
    { name: "MONGO_URI", scope: "Backend", sample: "mongodb+srv://user:pass@cluster.mongodb.net/resumeats", desc: "MongoDB database connection string" },
    { name: "JWT_SECRET", scope: "Backend", sample: "your_production_jwt_secret_key", desc: "Cryptographic secret for signing JWT auth tokens" },
    { name: "GEMINI_API_KEY", scope: "Backend", sample: "AIzaSy_your_gemini_api_key", desc: "Google Gemini 2.5 Flash API authentication key" },
    { name: "CLIENT_URL", scope: "Backend", sample: "https://resume-ats-ai.pages.dev", desc: "CORS allowed origin for frontend SPA" },
  ];

  return (
    <div className="deployment-wrapper">
      <div className="deployment-container">
        {/* PAGE HEADER */}
        <div className="deployment-header">
          <span className="deployment-tag">✦ DEPLOYMENT & INFRASTRUCTURE</span>
          <h2>ResumeATS AI Infrastructure</h2>
          <p className="deployment-sub">
            Production deployment architecture and environment configuration for ResumeATS AI.
          </p>
        </div>

        {/* CLOUDFLARE DEPLOYMENT SETUP NOTICE */}
        <div className="deployment-status-notice">
          <div className="notice-icon">ℹ️</div>
          <div className="notice-content">
            <strong>Cloudflare Pages Setup Guide:</strong> <code>https://resume-ats-ai.pages.dev</code> will become accessible once the GitHub repository (<code>Prasanna-Anjaneyulu078/AI-ATS-Resume-Analyzer</code>) is linked to your Cloudflare Pages dashboard.
            <div className="notice-steps-grid">
              <div className="step-item">
                <span className="step-num">1</span>
                <span>Open <strong>Cloudflare Dashboard</strong> → <strong>Workers & Pages</strong> → <strong>Create Application</strong> → <strong>Pages</strong> → <strong>Connect Git</strong></span>
              </div>
              <div className="step-item">
                <span className="step-num">2</span>
                <span>Select repository <code>AI-ATS-Resume-Analyzer</code> & production branch <code>main</code></span>
              </div>
              <div className="step-item">
                <span className="step-num">3</span>
                <span>Set Framework: <code>Vite</code>, Root: <code>client</code>, Build: <code>npm run build</code>, Output: <code>dist</code></span>
              </div>
              <div className="step-item">
                <span className="step-num">4</span>
                <span>Add Env Variable: <code>VITE_API_BASE_URL</code> = <code>https://resumeats-ai.onrender.com</code></span>
              </div>
            </div>
          </div>
        </div>

        {/* TROUBLESHOOTING CARD FOR CLOUDFLARE WRANGLER CLI ERROR 8000000 */}
        <div className="troubleshoot-card">
          <div className="troubleshoot-header">
            <span className="troubleshoot-icon">🛠</span>
            <div>
              <h4>Fixing Cloudflare API Error 8000000</h4>
              <p className="troubleshoot-sub">
                If <code>wrangler pages project create</code> returns <code>[ERROR] code: 8000000</code>, follow one of these 2 solutions:
              </p>
            </div>
          </div>

          <div className="troubleshoot-methods-grid">
            {/* METHOD 1: RECOMMENDED WEB DASHBOARD GUI */}
            <div className="method-box recommended">
              <div className="method-badge">Method 1 (Recommended)</div>
              <h5>Create via Cloudflare Web Dashboard (GUI)</h5>
              <p>Bypasses Wrangler CLI API permission errors completely:</p>
              <ol className="method-steps">
                <li>Log in to <a href="https://dash.cloudflare.com" target="_blank" rel="noreferrer">dash.cloudflare.com</a>.</li>
                <li>Go to <strong>Workers & Pages</strong> → <strong>Create application</strong> → <strong>Pages</strong> tab.</li>
                <li>Click <strong>Connect to Git</strong>, select <code>AI-ATS-Resume-Analyzer</code>.</li>
                <li>Set Framework: <code>Vite</code>, Root: <code>client</code>, Build: <code>npm run build</code>, Output: <code>dist</code>.</li>
                <li>Add Env Variable: <code>VITE_API_BASE_URL=https://resumeats-ai.onrender.com</code>.</li>
              </ol>
            </div>

            {/* METHOD 2: CLI FIX */}
            <div className="method-box">
              <div className="method-badge">Method 2 (Wrangler CLI)</div>
              <h5>Direct CLI Upload via Dist Folder</h5>
              <p>Re-authenticate wrangler and deploy compiled output folder directly:</p>
              <div className="code-block-container">
                <code>cd client</code>
                <code>npm run build</code>
                <code>npx wrangler login</code>
                <code>npx wrangler pages deploy dist --project-name=resumeats-ai</code>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 1: INFRASTRUCTURE STACK CARDS GRID */}
        <div className="section-block">
          <div className="section-title-row">
            <h3>Infrastructure Stack</h3>
            <span className="section-badge">Live Services</span>
          </div>

          <div className="infra-grid">
            {/* FRONTEND CARD */}
            <div className="infra-card">
              <div className="infra-card-header">
                <div className="infra-icon-box orange">⚡</div>
                <div className="infra-card-titles">
                  <h4>Frontend Single Page App</h4>
                  <span className="tech-tag">React 19 + Vite 7</span>
                </div>
              </div>
              <div className="infra-meta-list">
                <div className="meta-row">
                  <span className="meta-lbl">Platform</span>
                  <span className="meta-val highlight">Cloudflare Pages</span>
                </div>
                <div className="meta-row">
                  <span className="meta-lbl">Project</span>
                  <span className="meta-val">resume-ats-ai</span>
                </div>
                <div className="meta-row">
                  <span className="meta-lbl">Build Command</span>
                  <code className="code-pill">npm run build</code>
                </div>
                <div className="meta-row">
                  <span className="meta-lbl">Output Dir</span>
                  <code className="code-pill">dist</code>
                </div>
              </div>
              <div className="infra-status-footer">
                <span className="status-indicator active">●</span>
                <span className="status-text">Production / Connected</span>
              </div>
            </div>

            {/* BACKEND CARD */}
            <div className="infra-card">
              <div className="infra-card-header">
                <div className="infra-icon-box blue">🚀</div>
                <div className="infra-card-titles">
                  <h4>Backend REST API</h4>
                  <span className="tech-tag">Node.js + Express.js</span>
                </div>
              </div>
              <div className="infra-meta-list">
                <div className="meta-row">
                  <span className="meta-lbl">Platform</span>
                  <span className="meta-val highlight">Render</span>
                </div>
                <div className="meta-row">
                  <span className="meta-lbl">Root Directory</span>
                  <code className="code-pill">server</code>
                </div>
                <div className="meta-row">
                  <span className="meta-lbl">Build Command</span>
                  <code className="code-pill">npm install</code>
                </div>
                <div className="meta-row">
                  <span className="meta-lbl">Start Command</span>
                  <code className="code-pill">npm start</code>
                </div>
              </div>
              <div className="infra-status-footer">
                <span className="status-indicator active">●</span>
                <span className="status-text">Production / Connected</span>
              </div>
            </div>

            {/* DATABASE CARD */}
            <div className="infra-card">
              <div className="infra-card-header">
                <div className="infra-icon-box green">🍃</div>
                <div className="infra-card-titles">
                  <h4>Database Persistence</h4>
                  <span className="tech-tag">MongoDB (Mongoose ODM)</span>
                </div>
              </div>
              <div className="infra-meta-list">
                <div className="meta-row">
                  <span className="meta-lbl">Platform</span>
                  <span className="meta-val highlight">MongoDB Atlas / Cloud</span>
                </div>
                <div className="meta-row">
                  <span className="meta-lbl">Collections</span>
                  <span className="meta-val">Users, Resumes</span>
                </div>
                <div className="meta-row">
                  <span className="meta-lbl">Purpose</span>
                  <span className="meta-val desc">User accounts, saved ATS analyses, & score metrics</span>
                </div>
              </div>
              <div className="infra-status-footer">
                <span className="status-indicator active">●</span>
                <span className="status-text">Database / Active</span>
              </div>
            </div>

            {/* AI SERVICE CARD */}
            <div className="infra-card">
              <div className="infra-card-header">
                <div className="infra-icon-box purple">✨</div>
                <div className="infra-card-titles">
                  <h4>AI Analysis Engine</h4>
                  <span className="tech-tag">Google Gemini API</span>
                </div>
              </div>
              <div className="infra-meta-list">
                <div className="meta-row">
                  <span className="meta-lbl">Model</span>
                  <span className="meta-val highlight">gemini-2.5-flash</span>
                </div>
                <div className="meta-row">
                  <span className="meta-lbl">Resilience</span>
                  <span className="meta-val">Deterministic Fallback Engine</span>
                </div>
                <div className="meta-row">
                  <span className="meta-lbl">Purpose</span>
                  <span className="meta-val desc">Skill gap analysis, summary rewrites, & bullet improvements</span>
                </div>
              </div>
              <div className="infra-status-footer">
                <span className="status-indicator active">●</span>
                <span className="status-text">Gemini API / Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: ARCHITECTURE DIAGRAM */}
        <div className="section-block">
          <div className="section-title-row">
            <h3>Production Architecture Flow</h3>
            <span className="section-badge">System Topology</span>
          </div>

          <div className="architecture-diagram-card">
            <div className="arch-flow-container">
              {/* NODE 1: USER */}
              <div className="arch-node">
                <div className="node-icon-box">💻</div>
                <div className="node-info">
                  <span className="node-title">User Browser</span>
                  <span className="node-subtitle">Client Device</span>
                </div>
              </div>

              <div className="arch-arrow">➔</div>

              {/* NODE 2: CLOUDFLARE PAGES */}
              <div className="arch-node">
                <div className="node-icon-box orange">⚡</div>
                <div className="node-info">
                  <span className="node-title">Cloudflare Pages</span>
                  <span className="node-subtitle">React + Vite SPA</span>
                </div>
              </div>

              <div className="arch-arrow">➔</div>

              {/* NODE 3: RENDER API */}
              <div className="arch-node">
                <div className="node-icon-box blue">🚀</div>
                <div className="node-info">
                  <span className="node-title">Render</span>
                  <span className="node-subtitle">Node.js + Express API</span>
                </div>
              </div>

              <div className="arch-arrow">➔</div>

              {/* NODE 4: BACKEND SERVICES */}
              <div className="arch-split-nodes">
                <div className="arch-subnode green">
                  <span className="subnode-icon">🍃</span>
                  <span className="subnode-title">MongoDB</span>
                </div>
                <div className="arch-subnode purple">
                  <span className="subnode-icon">✨</span>
                  <span className="subnode-title">Google Gemini</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: PLATFORM DEPLOYMENT SPECIFICATIONS */}
        <div className="section-block">
          <div className="section-title-row">
            <h3>Deployment Configuration</h3>
            <span className="section-badge">Environment Details</span>
          </div>

          <div className="deployment-specs-grid">
            {/* CLOUDFLARE SPECIFICATION CARD */}
            <div className="spec-card">
              <div className="spec-header">
                <span className="spec-badge orange">Frontend Deployment</span>
                <h4>Cloudflare Pages Configuration</h4>
              </div>
              <div className="spec-rows-list">
                {frontendConfig.map((item, idx) => (
                  <div className="spec-row" key={idx}>
                    <span className="spec-lbl">{item.label}</span>
                    <div className="spec-val-box">
                      {item.link ? (
                        <a href={item.value} target="_blank" rel="noopener noreferrer" className="spec-link">
                          {item.value} ↗
                        </a>
                      ) : (
                        <span className="spec-txt">{item.value}</span>
                      )}
                      {item.copyable && (
                        <button
                          type="button"
                          className="btn-copy-mini"
                          onClick={() => handleCopy(item.value, `cf-${idx}`)}
                        >
                          {copiedKey === `cf-${idx}` ? "✓ Copied" : "Copy"}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RENDER SPECIFICATION CARD */}
            <div className="spec-card">
              <div className="spec-header">
                <span className="spec-badge blue">Backend Deployment</span>
                <h4>Render Web Service</h4>
              </div>
              <div className="spec-rows-list">
                {backendConfig.map((item, idx) => (
                  <div className="spec-row" key={idx}>
                    <span className="spec-lbl">{item.label}</span>
                    <div className="spec-val-box">
                      {item.link ? (
                        <a href={item.value} target="_blank" rel="noopener noreferrer" className="spec-link">
                          {item.value} ↗
                        </a>
                      ) : (
                        <span className="spec-txt">{item.value}</span>
                      )}
                      {item.copyable && (
                        <button
                          type="button"
                          className="btn-copy-mini"
                          onClick={() => handleCopy(item.value, `rnd-${idx}`)}
                        >
                          {copiedKey === `rnd-${idx}` ? "✓ Copied" : "Copy"}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: ENVIRONMENT VARIABLES SPECIFICATION */}
        <div className="section-block">
          <div className="section-title-row">
            <h3>Environment Variables Specification</h3>
            <span className="section-badge">Configuration Keys</span>
          </div>

          <div className="env-table-card">
            <div className="security-alert-box">
              <span className="alert-icon">🔒</span>
              <div className="alert-content">
                <strong>Security Policy:</strong> Production secrets (<code>JWT_SECRET</code>, <code>MONGO_URI</code>, <code>GEMINI_API_KEY</code>) are securely managed on Render and never committed to Git repositories.
              </div>
            </div>

            <div className="env-rows-container">
              {envVariables.map((env, idx) => (
                <div className="env-item-row" key={idx}>
                  <div className="env-item-main">
                    <code className="env-name">{env.name}</code>
                    <span className={`env-scope-pill ${env.scope.toLowerCase()}`}>{env.scope}</span>
                  </div>
                  <div className="env-item-details">
                    <span className="env-desc">{env.desc}</span>
                    <code className="env-sample">{env.name}=your_{env.name.toLowerCase()}</code>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deployment;
