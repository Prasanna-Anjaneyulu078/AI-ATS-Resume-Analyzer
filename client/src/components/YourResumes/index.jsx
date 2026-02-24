import React, { useState } from "react";
import "./index.css";
 
const YourResumes = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showModal, setShowModal] = useState(false);
 
 
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setError("");
  };
 
  const handleUploadAndAnalyze = async () => {
    if (!selectedFile) {
      setError("Please select a resume to upload.");
      return;
    }
 
    const token = localStorage.getItem("token");
 
    if (!token) {
      setError("You must be logged in.");
      return;
    }
 
    const formData = new FormData();
    formData.append("resume", selectedFile);
 
    try {
      setLoading(true);
      setError("");
 
      // STEP 1️⃣ Upload Resume
      const uploadResponse = await fetch(
        "http://localhost:5000/resume/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
 
      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        throw new Error(errorText || "Resume upload failed.");
      }
 
      const data = await uploadResponse.json();
 
      // STEP 2️⃣ Analyze Resume
      const rawData = {
        resumeText: data.text, // must match backend
        jobDescription:
          "ANYTHING YOU WANT! For best results, use a real job description from a role you're interested in.",
      };
 
      const analyzeResponse = await fetch(
        "http://localhost:5000/resume/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(rawData),
        }
      );
 
      if (!analyzeResponse.ok) {
        const errorText = await analyzeResponse.text();
        throw new Error(errorText || "Resume analysis failed.");
      }
      const analyzeData = await analyzeResponse.json();
      console.log(analyzeData)
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
      <h2>Upload Your Resume</h2>
 
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
 
       {showModal && analysisResult?.success && (
  <div className="modal-overlay">
    <div className="modal">
      <h2>ATS Resume Analysis Report</h2>
 
      {(() => {
        const report =
          analysisResult.suggestions?.analysis ??
          analysisResult.suggestions ??
          analysisResult;
 
        return (
          <>
            {/* Score */}
            <p>
              <strong>Compatibility Score:</strong>{" "}
              {report?.compatibility_score ?? analysisResult.score ?? "N/A"}%
            </p>
 
            {/* Resume Skills */}
            <h3>Resume Skills</h3>
            <ul>
              {report?.resume_skills?.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
 
            {/* Job Description Skills */}
            <h3>Job Description Skills</h3>
            <ul>
              {report?.job_description_skills?.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
 
            {/* Missing Skills */}
            <h3>Missing Skills (Add to Resume)</h3>
            <ul>
              {report?.missing_skills?.from_resume_for_job_description?.map(
                (skill, index) => (
                  <li key={index}>{skill}</li>
                )
              )}
            </ul>
 
            <h3>Extra Skills (Not Required by Job)</h3>
            <ul>
              {report?.missing_skills?.from_job_description_for_resume?.map(
                (skill, index) => (
                  <li key={index}>{skill}</li>
                )
              )}
            </ul>
 
            {/* ATS Optimization Tips */}
            <h3>ATS Optimization Tips</h3>
            <ul>
              {report?.ats_optimization_tips?.map((tip, index) => (
                <li key={index}>{tip.replace(/\*\*/g, "")}</li>
              ))}
            </ul>
 
            {/* Bullet Improvements */}
            <h3>Bullet Point Improvements</h3>
            {report?.ats_optimized_bullet_point_improvements?.map(
              (item, index) => (
                <div key={index} style={{ marginBottom: "15px" }}>
                  <p>
                    <strong>Original:</strong> {item.original_summary}
                  </p>
 
                  <p>
                    <strong>Reasoning:</strong> {item.reasoning}
                  </p>
 
                  <strong>Suggested Bullets:</strong>
                  <ul>
                    {item.suggested_bullets?.map((bullet, i) => (
                      <li key={i}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              )
            )}
 
            {/* Overall Assessment */}
            <h3>Overall Assessment</h3>
            <p>{report?.overall_assessment}</p>
 
            <button onClick={() => setShowModal(false)}>Close</button>
          </>
        );
      })()}
    </div>
  </div>
)}
 
 
 
 
 
 
      {error && <p className="error">{error}</p>}
    </div>
  );
};
 
export default YourResumes;