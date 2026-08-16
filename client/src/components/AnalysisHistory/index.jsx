import React, { useState, useEffect } from "react";
import ReportModal from "../YourResumes/ReportModal";
import { resumeService } from "../../services/resumeService.js";
import { authService } from "../../services/authService.js";
import "./index.css";

const AnalysisHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    fetchUserAndHistory();
  }, []);

  const fetchUserAndHistory = async () => {
    try {
      setLoading(true);
      setError("");
      const userData = await authService.getMe();
      if (userData?.user?.name) {
        setUserName(userData.user.name.split(" ")[0]);
      }

      const res = await resumeService.getHistory();
      if (res?.success) {
        setHistory(res.history || []);
      }
    } catch (err) {
      console.error("Failed to load analysis history:", err);
      setError(err.message || "Failed to load saved analyses.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewReport = (item) => {
    setSelectedAnalysis(item);
    setShowModal(true);
  };

  const handleDeleteReport = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this analysis report?")) return;

    try {
      await resumeService.deleteResume(id);
      setHistory((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Delete report error:", err);
      alert("Failed to delete analysis record. Please try again.");
    }
  };

  return (
    <div className="history-page-container">
      <div className="history-page-header">
        <span className="history-page-badge">✦ Analysis Reports</span>
        <h2>{userName ? `${userName}'s Analysis History` : "Analysis History"}</h2>
        <p className="history-page-sub">
          View, review, and manage your previous ATS resume analysis reports.
        </p>
      </div>

      {loading ? (
        <div className="history-loading-container">
          <div className="history-spinner"></div>
          <p>Loading your saved analyses...</p>
        </div>
      ) : error ? (
        <div className="history-error-alert">{error}</div>
      ) : history.length === 0 ? (
        <div className="history-empty-card">
          <div className="empty-icon">📊</div>
          <h3>No Saved Analyses Yet</h3>
          <p>You haven't run any ATS resume analyses yet. Start by analyzing a resume against a target Job Description.</p>
        </div>
      ) : (
        <div className="history-main-section">
          <div className="history-section-title-bar">
            <h3>Your Saved Resume Analyses</h3>
            <span className="count-pill">{history.length} saved</span>
          </div>

          <div className="history-grid-container">
            {history.map((item) => (
              <div
                key={item._id}
                className="history-report-card"
                onClick={() => handleViewReport(item)}
              >
                <div className="history-card-top">
                  <div className="role-company-group">
                    <h4 className="role-title">{item.jobTitle || "Software Engineer"}</h4>
                    <span className="company-name">{item.companyName || "Target Company"}</span>
                  </div>
                  <span
                    className={`score-badge ${
                      item.atsScore >= 75
                        ? "high"
                        : item.atsScore >= 50
                        ? "med"
                        : "low"
                    }`}
                  >
                    {item.atsScore}% ATS
                  </span>
                </div>

                <div className="history-card-details">
                  <div className="detail-item">
                    <span className="detail-label">Resume:</span>
                    <span className="detail-value">📄 {item.filename || "Resume.pdf"}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Analyzed:</span>
                    <span className="detail-value">
                      {new Date(item.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <div className="history-card-actions">
                  <button
                    className="btn-view-report-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewReport(item);
                    }}
                  >
                    View Report
                  </button>
                  <button
                    className="btn-delete-report-icon"
                    onClick={(e) => handleDeleteReport(item._id, e)}
                    title="Delete Analysis"
                    aria-label="Delete Analysis"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REPORT MODAL */}
      {showModal && selectedAnalysis && (
        <ReportModal
          analysisResult={selectedAnalysis}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default AnalysisHistory;
