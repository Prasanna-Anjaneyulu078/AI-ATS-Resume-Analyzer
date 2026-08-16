import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReportModal from "./ReportModal";
import { resumeService } from "../../services/resumeService.js";
import { authService } from "../../services/authService.js";
import "./index.css";

const YourResumes = () => {
  const location = useLocation();

  const [selectedFile, setSelectedFile] = useState(null);
  const [fileDetails, setFileDetails] = useState(null); // { name, size, type }
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [error, setError] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userName, setUserName] = useState("");

  const ANALYSIS_STEPS = [
    "Extracting resume content...",
    "Analyzing job description...",
    "Matching skills & keywords...",
    "Calculating ATS score...",
    "Finding missing skills...",
    "Generating AI optimization suggestions..."
  ];

  useEffect(() => {
    fetchUser();
  }, []);

  // Form reset behavior when navigating to "/analyzer"
  useEffect(() => {
    if (location.pathname === "/analyzer") {
      setJobTitle("");
      setCompanyName("");
      setJobDescription("");
      setAnalysisResult(null);
      setShowModal(false);
      setError("");
    }
  }, [location.pathname, location.key]);

  const fetchUser = async () => {
    try {
      const userData = await authService.getMe();
      if (userData?.user?.name) {
        setUserName(userData.user.name.split(" ")[0]);
      }
    } catch (err) {
      setUserName("");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setError("Please select a valid PDF file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit.");
      return;
    }

    setSelectedFile(file);
    setFileDetails({
      name: file.name,
      size: (file.size / 1024).toFixed(1) + " KB",
      type: "PDF"
    });
    setError("");
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFileDetails(null);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError("Please upload a resume PDF before starting analysis.");
      return;
    }

    if (!jobDescription || jobDescription.trim().length < 10) {
      setError("Please enter a valid Job Description (at least 10 characters).");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setCurrentStepIndex(0);

      // Inflight step progress simulation
      const stepInterval = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev < ANALYSIS_STEPS.length - 1) return prev + 1;
          return prev;
        });
      }, 700);

      const formData = new FormData();
      formData.append("resume", selectedFile);
      formData.append("jobDescription", jobDescription);
      formData.append("jobTitle", jobTitle);
      formData.append("companyName", companyName);

      const res = await resumeService.analyzeResume(formData);

      clearInterval(stepInterval);
      setCurrentStepIndex(ANALYSIS_STEPS.length - 1);

      if (res?.success && res?.analysis) {
        setAnalysisResult(res.analysis);
        setShowModal(true);
        // Automatically clear JD form fields AFTER successful analysis
        setJobTitle("");
        setCompanyName("");
        setJobDescription("");
      } else {
        throw new Error(res?.error || "Analysis failed.");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to analyze resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = selectedFile && jobDescription && jobDescription.trim().length >= 10;

  return (
    <div className="resume-container">
      <div className="workspace-header">
        <h2>{userName ? `Welcome back, ${userName}! 👋` : "ResumeATS AI Workspace"}</h2>
        <p className="workspace-sub">
          Compare your resume against any target job description to get a deterministic ATS score, matched vs. missing skills, and AI-driven optimizations.
        </p>
      </div>

      <div className="analysis-workspace-grid">
        {/* SECTION 1: RESUME UPLOAD */}
        <div className="workspace-card upload-card">
          <div className="card-title-bar">
            <span className="card-badge">Step 1</span>
            <h3>Upload Resume</h3>
          </div>

          {!selectedFile ? (
            <label className="dropzone-label">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden-file-input"
              />
              <div className="dropzone-content">
                <div className="dropzone-icon">📄</div>
                <div className="dropzone-text">
                  <strong>Click to upload</strong> or drag & drop PDF resume
                </div>
                <div className="dropzone-sub">PDF files up to 5MB</div>
              </div>
            </label>
          ) : (
            <div className="file-preview-card">
              <div className="file-info-main">
                <div className="pdf-icon">📄</div>
                <div className="file-meta">
                  <span className="file-name">{fileDetails?.name}</span>
                  <span className="file-type-size">
                    {fileDetails?.type} • {fileDetails?.size}
                  </span>
                  <span className="file-status-tag">✓ Ready for Analysis</span>
                </div>
              </div>
              <button
                type="button"
                className="btn-replace-resume"
                onClick={handleRemoveFile}
              >
                Replace Resume
              </button>
            </div>
          )}
        </div>

        {/* SECTION 2: JOB DESCRIPTION INPUT */}
        <div className="workspace-card jd-card">
          <div className="card-title-bar">
            <span className="card-badge">Step 2</span>
            <h3>Job Description</h3>
          </div>

          <div className="jd-fields-row">
            <div className="input-group">
              <label>Job Title (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Java Backend Developer"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>Company (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Example Technologies"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
          </div>

          <div className="input-group">
            <div className="textarea-label-row">
              <label>Paste Job Description *</label>
              <span className="char-counter">
                Characters: {jobDescription.length.toLocaleString()}
              </span>
            </div>
            <textarea
              placeholder="We are looking for a Software Engineer with experience in Java, Spring Boot, REST APIs, PostgreSQL..."
              rows={8}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ERROR DISPLAY */}
      {error && <div className="error-alert">{error}</div>}

      {/* SECTION 3: ANALYZE CTA & PROGRESS LOADER */}
      <div className="analyze-action-container">
        <button
          className="btn-analyze-primary"
          onClick={handleAnalyze}
          disabled={!isFormValid || loading}
        >
          {loading ? "Analyzing..." : "Analyze & Optimize Resume"}
        </button>

        {loading && (
          <div className="progress-steps-modal">
            <div className="progress-spinner"></div>
            <div className="progress-step-text">
              {ANALYSIS_STEPS[currentStepIndex]}
            </div>
            <div className="progress-bar-track">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${((currentStepIndex + 1) / ANALYSIS_STEPS.length) * 100}%`
                }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* REPORT MODAL */}
      {showModal && analysisResult && (
        <ReportModal
          analysisResult={analysisResult}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default YourResumes;
