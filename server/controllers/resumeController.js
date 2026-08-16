import Resume from "../models/Resume.js";
import { parseResume } from "../utils/resumeParser.js";
import { processJobDescription } from "../utils/jdProcessor.js";
import { extractNormalizedSkills } from "../utils/skillNormalizer.js";
import { calculateATSScore } from "../utils/atsScore.js";
import { analyzeWithGemini } from "../utils/aiAnalyzer.js";

/* =========================================================
   1. UPLOAD + PARSE RESUME PDF ONLY
   ========================================================= */
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No resume PDF file uploaded." });
    }

    if (req.file.size > 5 * 1024 * 1024) {
      return res.status(413).json({ error: "File size exceeds the 5MB limit." });
    }

    const uint8Array = new Uint8Array(
      req.file.buffer.buffer,
      req.file.buffer.byteOffset,
      req.file.buffer.byteLength
    );

    const text = await parseResume(uint8Array);

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        error: "Insufficient or no readable text extracted from PDF. Please upload a standard, text-selectable PDF."
      });
    }

    res.json({
      success: true,
      filename: req.file.originalname,
      fileSize: req.file.size,
      text,
      preview: text.substring(0, 500)
    });
  } catch (err) {
    console.error("Upload Resume Error:", err);
    res.status(500).json({ error: err.message || "Failed to process PDF resume." });
  }
};

/* =========================================================
   2. CORE WORKFLOW: RESUME + JD -> ATS SCORE -> MISSING SKILLS -> OPTIMIZATION
   Accepts multipart (file + body) OR JSON body (resumeText + jobDescription)
   ========================================================= */
export const analyzeResume = async (req, res) => {
  try {
    let resumeText = req.body.resumeText;
    let filename = req.body.filename || "Uploaded_Resume.pdf";
    let fileSize = req.body.fileSize ? Number(req.body.fileSize) : 0;

    // Handle single-step file upload if file is attached directly
    if (req.file) {
      if (req.file.size > 5 * 1024 * 1024) {
        return res.status(413).json({ error: "Resume file size exceeds 5MB limit." });
      }
      filename = req.file.originalname;
      fileSize = req.file.size;
      const uint8Array = new Uint8Array(
        req.file.buffer.buffer,
        req.file.buffer.byteOffset,
        req.file.buffer.byteLength
      );
      resumeText = await parseResume(uint8Array);
    }

    const jobDescription = req.body.jobDescription;
    const jobTitle = req.body.jobTitle || "";
    const companyName = req.body.companyName || "";

    // Validate inputs
    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({ error: "Resume content is required. Please upload a valid PDF resume." });
    }

    if (!jobDescription || jobDescription.trim().length < 10) {
      return res.status(400).json({ error: "Job description is required. Please paste a full job description (at least 10 characters)." });
    }

    if (jobDescription.length > 25000) {
      return res.status(400).json({ error: "Job description is too long. Please limit to under 25,000 characters." });
    }

    // Step A: Process Job Description
    const processedJD = processJobDescription(jobDescription, jobTitle, companyName);

    // Step B: Extract & Normalize Resume Skills
    const resumeSkills = extractNormalizedSkills(resumeText);
    const jdRequiredSkills = processedJD.requiredSkills || [];

    // Step C: Match Skills
    const matchedSkillsSet = new Set();
    const missingSkillsSet = new Set();

    jdRequiredSkills.forEach(skill => {
      const lowerSkill = skill.toLowerCase();
      const isMatched = resumeSkills.some(rs => rs.toLowerCase() === lowerSkill) ||
                        resumeText.toLowerCase().includes(lowerSkill);
      if (isMatched) {
        matchedSkillsSet.add(skill);
      } else {
        missingSkillsSet.add(skill);
      }
    });

    const matchedSkills = Array.from(matchedSkillsSet);
    const missingSkills = Array.from(missingSkillsSet);
    const partialMatches = []; // Reserved for fuzzy match extensions

    // Step D: Calculate Deterministic ATS Score & Breakdown
    const scoreBreakdown = calculateATSScore(processedJD, resumeText, matchedSkills, missingSkills);
    const overallScore = scoreBreakdown.overallScore;

    // Step E: Gemini AI Optimization Analysis
    const aiSuggestions = await analyzeWithGemini(
      resumeText,
      jobDescription,
      matchedSkills,
      missingSkills
    );

    // Step F: Persist Analysis Record in MongoDB
    const analysisRecord = await Resume.create({
      userId: req.user.id,
      filename,
      fileSize,
      jobTitle: processedJD.jobTitle,
      companyName: processedJD.companyName,
      jobDescription,
      resumeText,
      atsScore: overallScore,
      scoreBreakdown,
      matchedSkills,
      missingSkills,
      partialMatches,
      aiSuggestions,
    });

    res.status(200).json({
      success: true,
      analysis: {
        _id: analysisRecord._id,
        jobTitle: analysisRecord.jobTitle,
        companyName: analysisRecord.companyName,
        filename: analysisRecord.filename,
        fileSize: analysisRecord.fileSize,
        atsScore: overallScore,
        score: overallScore,
        scoreBreakdown,
        matchedSkills,
        missingSkills,
        partialMatches,
        aiSuggestions,
        createdAt: analysisRecord.createdAt,
      },
    });
  } catch (err) {
    console.error("Analyze Resume Error:", err);
    res.status(500).json({ error: err.message || "An unexpected error occurred during resume analysis." });
  }
};

/* =========================================================
   3. FETCH RESUME HISTORY FOR USER
   ========================================================= */
export const getResumeHistory = async (req, res) => {
  try {
    const history = await Resume.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .select("-resumeText -jobDescription");

    res.json({
      success: true,
      count: history.length,
      history,
    });
  } catch (err) {
    console.error("Get History Error:", err);
    res.status(500).json({ error: "Failed to fetch resume analysis history." });
  }
};

/* =========================================================
   4. DELETE SAVED RESUME ANALYSIS
   ========================================================= */
export const deleteResume = async (req, res) => {
  try {
    const record = await Resume.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!record) {
      return res.status(404).json({ error: "Analysis record not found or unauthorized." });
    }

    res.json({ success: true, message: "Resume analysis deleted successfully." });
  } catch (err) {
    console.error("Delete Resume Error:", err);
    res.status(500).json({ error: "Failed to delete analysis record." });
  }
};