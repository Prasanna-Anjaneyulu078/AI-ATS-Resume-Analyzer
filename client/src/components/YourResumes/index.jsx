import React, { useState, useEffect } from "react";
import ReportModal from "./ReportModal";
import { resumeService } from "../../services/resumeService.js";
import { authService } from "../../services/authService.js";
import "./index.css";

 
const YourResumes = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await authService.getMe();
        if (data && data.user && data.user.name) {
          setUserName(data.user.name.split(" ")[0]);
        }
      } catch {
        setUserName("");
      }
    };
    fetchUser();
  }, []);
 
 
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setError("");
  };
 
  const handleUploadAndAnalyze = async () => {
    if (!selectedFile) {
      setError("Please select a resume to upload.");
      return;
    }
 
    const formData = new FormData();
    formData.append("resume", selectedFile);
 
    try {
      setLoading(true);
      setError("");
 
      // STEP 1️⃣ Upload Resume
      const uploadData = await resumeService.uploadResume(formData);
 
      // STEP 2️⃣ Analyze Resume
      const jobDescription =
        "ANYTHING YOU WANT! For best results, use a real job description from a role you're interested in.";

      const analyzeData = await resumeService.analyzeResume(uploadData.text, jobDescription);
 
      setAnalysisResult(analyzeData);
      setShowModal(true);

 
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

 
  return (
    <div className="resume-container">
      <h2>{userName ? `Welcome back, ${userName}! 👋` : "Upload Your Resume"}</h2>

 
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
      />
 
      <button onClick={handleUploadAndAnalyze} disabled={loading}>
        {loading ? "Processing..." : "Upload & Analyze"}
      </button>
 
      {analysisResult && (
        <button onClick={() => setShowModal(true)}>
            View Report
        </button>
        )}
 
      {showModal && analysisResult && (
        <ReportModal
          analysisResult={analysisResult}
          onClose={() => setShowModal(false)}
        />
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
};
 
export default YourResumes;
