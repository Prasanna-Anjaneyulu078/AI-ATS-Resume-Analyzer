import React, { useState } from "react";
import "./index.css";

const ReportModal = ({ analysisResult, onClose }) => {
  const [activeTab, setActiveTab] = useState("overview");

  if (!analysisResult) return null;

  const report =
    analysisResult.suggestions?.analysis ??
    analysisResult.suggestions ??
    analysisResult;

  const score = Math.min(
    100,
    Math.max(0, parseInt(report?.compatibility_score ?? analysisResult.score ?? 0, 10))
  );

  const getScoreTheme = (s) => {
    if (s >= 75) return { color: "#00c896", label: "Excellent Match", bg: "rgba(0, 200, 150, 0.15)" };
    if (s >= 50) return { color: "#ffb703", label: "Moderate Match", bg: "rgba(255, 183, 3, 0.15)" };
    return { color: "#ff5252", label: "Needs Optimization", bg: "rgba(255, 82, 82, 0.15)" };
  };

  const theme = getScoreTheme(score);

  const resumeSkills = report?.resume_skills || [];
  const jobSkills = report?.job_description_skills || [];
  const missingSkills = report?.missing_skills?.from_resume_for_job_description || [];
  const extraSkills = report?.missing_skills?.from_job_description_for_resume || [];
  const atsTips = report?.ats_optimization_tips || [];
  const bulletImprovements = report?.ats_optimized_bullet_point_improvements || [];

  // Calculate SVG Circle Stroke Offset
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="report-modal-overlay" onClick={onClose}>
      <div className="report-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="report-modal-header">
          <div className="header-title-group">
            <span className="report-badge">✦ ResumeATS AI Report</span>
            <h2>ResumeATS AI Analysis Dashboard</h2>

          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close Report">
            ✕
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="report-nav-tabs">
          <button
            className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            <svg className="tab-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="9" rx="1"></rect>
              <rect x="14" y="3" width="7" height="5" rx="1"></rect>
              <rect x="14" y="12" width="7" height="9" rx="1"></rect>
              <rect x="3" y="16" width="7" height="5" rx="1"></rect>
            </svg>
            <span>Overview</span>
          </button>

          <button
            className={`tab-btn ${activeTab === "skills" ? "active" : ""}`}
            onClick={() => setActiveTab("skills")}
          >
            <svg className="tab-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
            <span>Skills Gap</span>
            {missingSkills.length > 0 && (
              <span className="tab-counter warning">{missingSkills.length}</span>
            )}
          </button>

          <button
            className={`tab-btn ${activeTab === "bullets" ? "active" : ""}`}
            onClick={() => setActiveTab("bullets")}
          >
            <svg className="tab-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
            <span>Bullet Rewrites</span>
            {bulletImprovements.length > 0 && (
              <span className="tab-counter accent">{bulletImprovements.length}</span>
            )}
          </button>

          <button
            className={`tab-btn ${activeTab === "tips" ? "active" : ""}`}
            onClick={() => setActiveTab("tips")}
          >
            <svg className="tab-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8.5 14.5A6 6 0 1 1 15.5 14.5M9 18h6M10 21h4"></path>
            </svg>
            <span>ATS Tips</span>
            {atsTips.length > 0 && (
              <span className="tab-counter info">{atsTips.length}</span>
            )}
          </button>
        </div>


        {/* Tab 1: Overview */}
        {activeTab === "overview" && (
          <div className="tab-pane fade-in">
            <div className="score-hero-card" style={{ borderColor: theme.color }}>
              <div className="score-gauge-container">
                <svg width="130" height="130" viewBox="0 0 130 130" className="gauge-svg">
                  <circle
                    cx="65"
                    cy="65"
                    r={radius}
                    className="gauge-bg"
                    strokeWidth="10"
                  />
                  <circle
                    cx="65"
                    cy="65"
                    r={radius}
                    className="gauge-progress"
                    strokeWidth="10"
                    stroke={theme.color}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                  />
                </svg>
                <div className="score-inner-text">
                  <span className="score-number">{score}%</span>
                  <span className="score-label">Match</span>
                </div>
              </div>

              <div className="score-summary-info">
                <div className="match-status-badge" style={{ color: theme.color, background: theme.bg }}>
                  {theme.label}
                </div>
                <h3>ATS Compatibility Assessment</h3>
                <p>
                  Your resume has been parsed and evaluated against job requirements using AI-powered ATS algorithms.
                </p>
                <div className="quick-stats-row">
                  <div className="stat-pill">
                    <span className="stat-value">{resumeSkills.length}</span>
                    <span className="stat-name">Detected Skills</span>
                  </div>
                  <div className="stat-pill warning">
                    <span className="stat-value">{missingSkills.length}</span>
                    <span className="stat-name">Missing Skills</span>
                  </div>
                  <div className="stat-pill accent">
                    <span className="stat-value">{bulletImprovements.length}</span>
                    <span className="stat-name">Rewrites</span>
                  </div>
                </div>
              </div>
            </div>

            {report?.overall_assessment && (
              <div className="report-card overall-assessment-card">
                <div className="card-header">
                  <span className="card-icon">💡</span>
                  <h4>Overall Assessment</h4>
                </div>
                <p>{report.overall_assessment}</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Skills Gap */}
        {activeTab === "skills" && (
          <div className="tab-pane fade-in">
            {missingSkills.length > 0 && (
              <div className="report-card skills-card warning-card">
                <div className="card-header">
                  <span className="card-icon">⚠️</span>
                  <h4>Missing Skills (Add to Resume)</h4>
                </div>
                <p className="card-subtitle">
                  These keywords were found in the job description but are missing from your resume. Adding them will improve your ATS ranking.
                </p>
                <div className="skills-badge-grid">
                  {missingSkills.map((skill, index) => (
                    <span key={index} className="skill-badge missing-badge">
                      + {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {resumeSkills.length > 0 && (
              <div className="report-card skills-card">
                <div className="card-header">
                  <span className="card-icon">✓</span>
                  <h4>Matched Resume Skills</h4>
                </div>
                <div className="skills-badge-grid">
                  {resumeSkills.map((skill, index) => (
                    <span key={index} className="skill-badge matched-badge">
                      ✓ {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {jobSkills.length > 0 && (
              <div className="report-card skills-card">
                <div className="card-header">
                  <span className="card-icon">🎯</span>
                  <h4>Job Description Required Skills</h4>
                </div>
                <div className="skills-badge-grid">
                  {jobSkills.map((skill, index) => (
                    <span key={index} className="skill-badge job-badge">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {extraSkills.length > 0 && (
              <div className="report-card skills-card">
                <div className="card-header">
                  <span className="card-icon">⭐</span>
                  <h4>Extra Resume Skills</h4>
                </div>
                <div className="skills-badge-grid">
                  {extraSkills.map((skill, index) => (
                    <span key={index} className="skill-badge extra-badge">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Bullet Point Improvements */}
        {activeTab === "bullets" && (
          <div className="tab-pane fade-in">
            {bulletImprovements.length === 0 ? (
              <p className="empty-state-text">No bullet point rewrites required.</p>
            ) : (
              <div className="bullet-rewrites-container">
                {bulletImprovements.map((item, index) => (
                  <div key={index} className="rewrite-card">
                    <div className="rewrite-section original-section">
                      <span className="rewrite-label original-label">Original Experience Summary</span>
                      <p>{item.original_summary}</p>
                    </div>

                    {item.reasoning && (
                      <div className="rewrite-reasoning">
                        <span className="reasoning-badge">Analysis</span>
                        <p>{item.reasoning}</p>
                      </div>
                    )}

                    <div className="rewrite-section suggested-section">
                      <span className="rewrite-label suggested-label">✨ ATS Optimized Suggestions</span>
                      <ul className="suggested-bullet-list">
                        {item.suggested_bullets?.map((bullet, i) => (
                          <li key={i}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: ATS Optimization Tips */}
        {activeTab === "tips" && (
          <div className="tab-pane fade-in">
            <div className="report-card tips-card">
              <div className="card-header">
                <span className="card-icon">🚀</span>
                <h4>Actionable ATS Optimization Tips</h4>
              </div>
              <ul className="tips-list">
                {atsTips.map((tip, index) => (
                  <li key={index} className="tip-item">
                    <span className="tip-number">#{index + 1}</span>
                    <p>{tip.replace(/\*\*/g, "")}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Modal Footer */}
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
