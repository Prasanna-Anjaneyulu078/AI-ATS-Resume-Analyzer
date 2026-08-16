import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReportModal from "../YourResumes/ReportModal";
import { resumeService } from "../../services/resumeService.js";
import { authService } from "../../services/authService.js";
import "./index.css";

const AnalysisHistory = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [userName, setUserName] = useState("");
  const [deleting, setDeleting] = useState(false);

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

  const handleOpenDeleteModal = (item, e) => {
    e.stopPropagation();
    setItemToDelete(item);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      setDeleting(true);
      await resumeService.deleteResume(itemToDelete._id);
      setHistory((prev) => prev.filter((i) => i._id !== itemToDelete._id));
      setItemToDelete(null);
    } catch (err) {
      console.error("Delete report error:", err);
      alert("Failed to delete analysis record. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const getScoreThemeClass = (score) => {
    if (score >= 75) return "high";
    if (score >= 50) return "med";
    return "low";
  };

  return (
    <div className="history-page-container">
      <div className="history-page-header">
        <span className="history-page-badge">Analysis History</span>
        <h2>{userName ? `${userName}'s Saved Analyses` : "Your Saved Resume Analyses"}</h2>
        <p className="history-page-sub">
          Review, analyze, and manage your previous ATS resume compatibility reports.
        </p>
      </div>

      {loading ? (
        <div className="history-loading-container">
          <div className="history-spinner"></div>
          <p>Loading your saved analyses...</p>
        </div>
      ) : error ? (
        <div className="history-error-card">
          <p className="error-msg">{error}</p>
          <button className="btn-retry" onClick={fetchUserAndHistory}>
            Retry
          </button>
        </div>
      ) : history.length === 0 ? (
        <div className="history-empty-card">
          <div className="empty-icon">📊</div>
          <h3>No Saved Analyses Yet</h3>
          <p>Analyze your resume against a target job description to view your ATS compatibility report here.</p>
          <button className="btn-empty-cta" onClick={() => navigate("/resumes")}>
            Analyze Resume
          </button>
        </div>
      ) : (
        <div className="history-main-section">
          <div className="history-section-title-bar">
            <h3>Your Saved Resume Analyses</h3>
            <span className="count-pill">{history.length} saved</span>
          </div>

          <div className="history-grid-container">
            {history.map((item) => {
              const scoreClass = getScoreThemeClass(item.atsScore || 0);
              const formattedDate = item.createdAt
                ? new Date(item.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "Recent";

              return (
                <div
                  key={item._id}
                  className="history-report-card"
                  onClick={() => handleViewReport(item)}
                >
                  {/* CARD HEADER ROW: SCORE NODE & JOB TITLES */}
                  <div className="card-top-layout">
                    <div className={`card-score-block ${scoreClass}`}>
                      <span className="card-score-number">{item.atsScore || 0}%</span>
                      <span className="card-score-label">ATS Score</span>
                    </div>

                    <div className="role-company-group">
                      <h4 className="role-title">{item.jobTitle || "Software Engineer"}</h4>
                      {item.companyName && (
                        <span className="company-name">{item.companyName}</span>
                      )}
                    </div>
                  </div>

                  {/* METADATA SECTION */}
                  <div className="history-card-details">
                    <div className="detail-meta-cell">
                      <span className="detail-label">RESUME</span>
                      <span className="detail-val file-val">{item.filename || "Resume.pdf"}</span>
                    </div>
                    <div className="detail-meta-cell">
                      <span className="detail-label">ANALYZED</span>
                      <span className="detail-val">{formattedDate}</span>
                    </div>
                  </div>

                  {/* ACTION BUTTONS BAR */}
                  <div className="history-card-actions">
                    <button
                      type="button"
                      className="btn-view-report-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewReport(item);
                      }}
                    >
                      View Report
                    </button>
                    <button
                      type="button"
                      className="btn-delete-report-secondary"
                      onClick={(e) => handleOpenDeleteModal(item, e)}
                      title="Delete Analysis"
                      aria-label="Delete Analysis"
                    >
                      <span>🗑</span> Delete
                    </button>
                  </div>
                </div>
              );
            })}
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

      {/* CONFIRMATION POPUP MODAL */}
      {itemToDelete && (
        <div className="confirm-modal-overlay" onClick={() => setItemToDelete(null)}>
          <div className="confirm-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-modal-icon">⚠️</div>
            <h3 className="confirm-modal-title">Delete Analysis Report?</h3>
            <p className="confirm-modal-text">
              Are you sure you want to permanently delete this saved ATS analysis report? This action cannot be undone.
            </p>
            <div className="confirm-item-preview">
              <span className="preview-role">{itemToDelete.jobTitle || "Software Engineer"}</span>
              {itemToDelete.companyName && (
                <span className="preview-company">{itemToDelete.companyName}</span>
              )}
            </div>
            <div className="confirm-modal-actions">
              <button
                type="button"
                className="btn-modal-cancel"
                onClick={() => setItemToDelete(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-modal-delete-danger"
                onClick={handleConfirmDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete Report"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisHistory;
