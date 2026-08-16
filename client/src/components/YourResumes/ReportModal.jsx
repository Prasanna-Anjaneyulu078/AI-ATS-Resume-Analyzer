import React, { useState } from "react";
import "./index.css";

const ReportModal = ({ analysisResult, onClose }) => {
  const [activeTab, setActiveTab] = useState("all");

  if (!analysisResult) return null;

  // Extract analysis payload safely across different wrapper levels
  const resultData = analysisResult.analysis || analysisResult;
  const ai = resultData.aiSuggestions || resultData.suggestions?.analysis || resultData.suggestions || {};

  // Extract ATS Score
  const rawScore = resultData.atsScore ?? resultData.score ?? resultData.scoreBreakdown?.overallScore ?? 0;
  const score = Math.min(100, Math.max(0, parseInt(rawScore, 10) || 0));

  // Theme configuration based on ATS score
  const getScoreTheme = (s) => {
    if (s >= 75) return { color: "#166534", label: "Excellent Match", bg: "#F0FDF4", border: "#BBF7D0" };
    if (s >= 50) return { color: "#1e40af", label: "Good Match", bg: "#eff6ff", border: "#bfdbfe" };
    return { color: "#991b1b", label: "Needs Optimization", bg: "#fef2f2", border: "#fecaca" };
  };
  const theme = getScoreTheme(score);

  // SVG Gauge calculation (140x140 viewBox)
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Job Info (hide if blank / default placeholders)
  const jobTitle = resultData.jobTitle && typeof resultData.jobTitle === "string" && resultData.jobTitle.trim() !== "" && resultData.jobTitle.trim() !== "Target Role"
    ? resultData.jobTitle.trim()
    : null;

  const companyName = resultData.companyName && typeof resultData.companyName === "string" && resultData.companyName.trim() !== ""
    ? resultData.companyName.trim()
    : null;

  const filename = resultData.filename || "Resume.pdf";

  // Score Breakdown
  const rawBreakdown = resultData.scoreBreakdown || {};
  const breakdown = {
    keywordScore: rawBreakdown.keywordScore ?? rawBreakdown.keywordMatch ?? Math.round(score * 0.95),
    skillScore: rawBreakdown.skillScore ?? rawBreakdown.skillMatch ?? Math.round(score * 0.9),
    experienceScore: rawBreakdown.experienceScore ?? rawBreakdown.experienceMatch ?? Math.max(50, Math.round(score * 0.85)),
    educationScore: rawBreakdown.educationScore ?? rawBreakdown.educationMatch ?? 90,
    formattingScore: rawBreakdown.formattingScore ?? rawBreakdown.formatting ?? 88,
  };

  // Skills
  const matchedSkills = Array.isArray(resultData.matchedSkills) ? resultData.matchedSkills : [];
  const missingSkills = Array.isArray(resultData.missingSkills) ? resultData.missingSkills : [];
  const partialMatches = Array.isArray(resultData.partialMatches) ? resultData.partialMatches : [];

  // AI Content
  const summaryImprovement = typeof ai.summaryImprovement === "string" ? ai.summaryImprovement : "";
  const optimizationSuggestions = Array.isArray(ai.optimizationSuggestions) ? ai.optimizationSuggestions : (Array.isArray(ai.ats_optimization_tips) ? ai.ats_optimization_tips : []);
  const bulletPointImprovements = Array.isArray(ai.bulletPointImprovements) ? ai.bulletPointImprovements : (Array.isArray(ai.ats_optimized_bullet_point_improvements) ? ai.ats_optimized_bullet_point_improvements : []);
  const missingSkillExplanations = Array.isArray(ai.missingSkillExplanations) ? ai.missingSkillExplanations : [];
  const strengths = Array.isArray(ai.strengths) ? ai.strengths : [];
  const weaknesses = Array.isArray(ai.weaknesses) ? ai.weaknesses : [];
  const overallAssessment = typeof ai.overallAssessment === "string" ? ai.overallAssessment : (typeof ai.overall_assessment === "string" ? ai.overall_assessment : "");

  return (
    <div className="report-modal-overlay" onClick={onClose}>
      <div className="report-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="report-modal-header">
          <div className="header-title-group">
            <span className="report-badge">✦ ResumeATS AI Analysis</span>
            <h2>{jobTitle ? `${jobTitle} Report` : "ATS Resume Analysis Report"}</h2>
            {companyName && <span className="header-company-subtitle">Company: <strong>{companyName}</strong></span>}
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close Report">
            ✕
          </button>
        </div>

        {/* NAVIGATION TABS / QUICK JUMP FILTER */}
        <div className="report-nav-tabs">
          <button
            className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            <span>Full Report</span>
          </button>
          <button
            className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            <span>Score Breakdown</span>
          </button>
          <button
            className={`tab-btn ${activeTab === "skills" ? "active" : ""}`}
            onClick={() => setActiveTab("skills")}
          >
            <span>Skills Gap ({matchedSkills.length}/{matchedSkills.length + missingSkills.length})</span>
          </button>
          <button
            className={`tab-btn ${activeTab === "ai" ? "active" : ""}`}
            onClick={() => setActiveTab("ai")}
          >
            <span>AI Optimizations</span>
          </button>
        </div>

        {/* REPORT MAIN SCROLLABLE CONTAINER */}
        <div className="report-scroll-body">
          {/* SECTION 1: HERO ATS SCORE & JOB INFO */}
          {(activeTab === "all" || activeTab === "overview") && (
            <div className="report-section-block fade-in">
              {/* ATS COMPATIBILITY SUMMARY CARD */}
              <div className="ats-compatibility-summary-card">
                <div className="summary-card-header-bar">
                  <span className="summary-card-tag">ATS COMPATIBILITY</span>
                </div>

                <div className="summary-hero-row">
                  <div className="score-hero-node">
                    <span className="hero-score-val">{score}%</span>
                    <span className="hero-score-lbl">ATS Score</span>
                  </div>

                  <div className="status-badge-container">
                    <span
                      className="summary-match-badge"
                      style={{
                        color: theme.color,
                        backgroundColor: theme.bg,
                        borderColor: theme.border,
                      }}
                    >
                      {theme.label}
                    </span>
                    <span className="badge-caption-sub">Based on your resume</span>
                  </div>
                </div>

                <div className="summary-overview-block">
                  <h4>ATS Compatibility Overview</h4>
                  <p>
                    Your resume was evaluated against the selected job requirements using keyword matching and AI analysis.
                  </p>
                </div>

                {(jobTitle || companyName || filename) && (
                  <div className="summary-meta-grid">
                    {jobTitle && (
                      <div className="meta-cell">
                        <span className="meta-label">TARGET ROLE</span>
                        <span className="meta-val">{jobTitle}</span>
                      </div>
                    )}

                    {companyName && (
                      <div className="meta-cell">
                        <span className="meta-label">COMPANY</span>
                        <span className="meta-val">{companyName}</span>
                      </div>
                    )}

                    {filename && (
                      <div className="meta-cell meta-cell-full">
                        <span className="meta-label">RESUME</span>
                        <span className="meta-val file-val">📄 {filename}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* DETAILED SCORE BREAKDOWN */}
              <div className="report-card">
                <div className="card-header">
                  <span className="card-icon">📊</span>
                  <h4>ATS Score Breakdown</h4>
                </div>
                <div className="breakdown-bars-grid">
                  {[
                    { label: "Keyword Match", val: breakdown.keywordScore, color: "#00c896" },
                    { label: "Skill Match", val: breakdown.skillScore, color: "#00A3FF" },
                    { label: "Experience Match", val: breakdown.experienceScore, color: "#8b5cf6" },
                    { label: "Education Match", val: breakdown.educationScore, color: "#f59e0b" },
                    { label: "Formatting Score", val: breakdown.formattingScore, color: "#10b981" },
                  ].map((item, i) => (
                    <div key={i} className="breakdown-item">
                      <div className="breakdown-label-row">
                        <span>{item.label}</span>
                        <span className="breakdown-pct" style={{ color: item.color }}>{item.val}%</span>
                      </div>
                      <div className="breakdown-track">
                        <div
                          className="breakdown-fill"
                          style={{
                            width: `${item.val}%`,
                            background: item.color
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: MATCHED, MISSING & PARTIAL SKILLS */}
          {(activeTab === "all" || activeTab === "skills") && (
            <div className="report-section-block fade-in">
              {/* MATCHED SKILLS */}
              <div className="report-card">
                <div className="card-header">
                  <span className="card-icon">✓</span>
                  <h4>Matched Skills ({matchedSkills.length})</h4>
                </div>
                {matchedSkills.length === 0 ? (
                  <p className="empty-state-text">No direct skill matches detected in resume text.</p>
                ) : (
                  <div className="skills-badge-grid">
                    {matchedSkills.map((skill, index) => (
                      <span key={index} className="skill-badge matched-badge">
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* MISSING SKILLS */}
              <div className="report-card warning-card">
                <div className="card-header">
                  <span className="card-icon">⚠️</span>
                  <h4>Missing Skills ({missingSkills.length})</h4>
                </div>
                <p className="card-subtitle">
                  Required or preferred skills in the Job Description not detected in your resume:
                </p>

                {missingSkills.length === 0 ? (
                  <p style={{ color: '#00c896', fontWeight: 600, margin: 0 }}>Great job! No major missing skills detected.</p>
                ) : (
                  <div className="skills-badge-grid">
                    {missingSkills.map((skill, index) => (
                      <span key={index} className="skill-badge missing-badge">
                        ⚠ {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* PARTIAL MATCHES */}
              {partialMatches.length > 0 && (
                <div className="report-card">
                  <div className="card-header">
                    <span className="card-icon">⚡</span>
                    <h4>Partial Matches ({partialMatches.length})</h4>
                  </div>
                  <div className="skills-badge-grid">
                    {partialMatches.map((skill, index) => (
                      <span key={index} className="skill-badge partial-badge">
                        ⚡ {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* DETAILED MISSING SKILL RECOMMENDATIONS */}
              {missingSkillExplanations.length > 0 && (
                <div className="missing-skill-explanations-list">
                  <h4 className="sub-section-title">Missing Skill Priority & Guidance</h4>
                  {missingSkillExplanations.map((item, idx) => (
                    <div key={idx} className="missing-explanation-card">
                      <div className="explanation-header-row">
                        <h5 className="missing-skill-name">⚠ {item.skill}</h5>
                        {item.importance && (
                          <span className="priority-tag">{item.importance} Priority</span>
                        )}
                      </div>
                      {item.explanation && <p className="explanation-text">{item.explanation}</p>}
                      {item.recommendation && (
                        <div className="recommendation-box">
                          <strong>Recommendation:</strong> {item.recommendation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SECTION 3: STRENGTHS, WEAKNESSES & OVERALL ASSESSMENT */}
          {(activeTab === "all" || activeTab === "ai") && (
            <div className="report-section-block fade-in">
              {/* STRENGTHS AND WEAKNESSES */}
              {(strengths.length > 0 || weaknesses.length > 0) && (
                <div className="strengths-weaknesses-grid">
                  {strengths.length > 0 && (
                    <div className="report-card strength-card">
                      <div className="card-header">
                        <span className="card-icon">💪</span>
                        <h4>Strengths</h4>
                      </div>
                      <ul className="bullet-list green">
                        {strengths.map((st, i) => (
                          <li key={i}>✓ {st}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {weaknesses.length > 0 && (
                    <div className="report-card weakness-card">
                      <div className="card-header">
                        <span className="card-icon">📌</span>
                        <h4>Areas to Improve</h4>
                      </div>
                      <ul className="bullet-list red">
                        {weaknesses.map((w, i) => (
                          <li key={i}>• {w}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* OVERALL ASSESSMENT */}
              {overallAssessment && (
                <div className="report-card assessment-card">
                  <div className="card-header">
                    <span className="card-icon">💡</span>
                    <h4>Overall Assessment</h4>
                  </div>
                  <p className="assessment-body-text">{overallAssessment}</p>
                </div>
              )}
            </div>
          )}

          {/* SECTION 4: AI RESUME OPTIMIZATION & BULLET REWRITES */}
          {(activeTab === "all" || activeTab === "ai") && (
            <div className="report-section-block fade-in">
              {/* PROFESSIONAL SUMMARY OPTIMIZATION */}
              {summaryImprovement && (
                <div className="report-card">
                  <div className="card-header">
                    <span className="card-icon">📝</span>
                    <h4>Professional Summary Optimization</h4>
                  </div>
                  <p className="card-subtitle">Recommended summary tailored for this position:</p>
                  <div className="summary-quote-box">
                    {summaryImprovement}
                  </div>
                </div>
              )}

              {/* BULLET POINT IMPROVEMENTS (BEFORE VS AFTER) */}
              {bulletPointImprovements.length > 0 && (
                <div className="bullet-rewrites-container">
                  <h4 className="sub-section-title">✨ Bullet Point Improvements (Before & After)</h4>
                  {bulletPointImprovements.map((item, index) => {
                    const beforeText = item.original_summary || item.before || "Generic experience description";
                    const afterBullets = item.suggested_bullets || (item.after ? [item.after] : []);

                    return (
                      <div key={index} className="rewrite-card">
                        {/* BEFORE */}
                        <div className="rewrite-section original-section">
                          <span className="rewrite-label original-label">Before (Original)</span>
                          <p>{beforeText}</p>
                        </div>

                        {/* AFTER */}
                        <div className="rewrite-section suggested-section">
                          <span className="rewrite-label suggested-label">✨ After (ATS Optimized)</span>
                          <ul className="suggested-bullet-list">
                            {afterBullets.map((bullet, i) => (
                              <li key={i}>{bullet}</li>
                            ))}
                          </ul>
                        </div>

                        {/* REASONING */}
                        {item.reasoning && (
                          <div className="rewrite-reasoning">
                            <span className="reasoning-badge">Reasoning</span>
                            <p>{item.reasoning}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* OPTIMIZATION SUGGESTIONS */}
              {optimizationSuggestions.length > 0 && (
                <div className="report-card">
                  <div className="card-header">
                    <span className="card-icon">🚀</span>
                    <h4>AI Optimization Suggestions</h4>
                  </div>
                  <ol className="suggestions-ordered-list">
                    {optimizationSuggestions.map((sug, index) => (
                      <li key={index} className="suggestion-item">
                        <span className="sug-num">{index + 1}</span>
                        <p>{sug.replace(/\*\*/g, "")}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="report-modal-footer">
          <button className="footer-btn secondary" onClick={onClose}>
            Close Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
