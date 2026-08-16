/**
 * Deterministic ATS Scoring Engine
 * Computes reproducible ATS score breakdown based on Resume and JD content.
 */

export function calculateATSScore(processedJD, resumeText, matchedSkills, missingSkills) {
  const resumeLower = (resumeText || "").toLowerCase();

  // 1. SKILL MATCH SCORE (Weight: 35%)
  const totalJDSkills = (matchedSkills.length + missingSkills.length);
  let skillScore = 70; // baseline if no specific skills extracted
  if (totalJDSkills > 0) {
    skillScore = Math.round((matchedSkills.length / totalJDSkills) * 100);
  }

  // 2. KEYWORD MATCH SCORE (Weight: 25%)
  const jdKeywords = processedJD.keywords || [];
  let keywordScore = 75;
  if (jdKeywords.length > 0) {
    const matchedCount = jdKeywords.filter(kw => resumeLower.includes(kw.toLowerCase())).length;
    keywordScore = Math.min(100, Math.round((matchedCount / jdKeywords.length) * 100));
  }

  // 3. EXPERIENCE RELEVANCE SCORE (Weight: 20%)
  let experienceScore = 60; // baseline
  const expKeywords = [
    "developed", "built", "designed", "implemented", "managed", "led", "architected",
    "created", "increased", "reduced", "improved", "optimized", "spearheaded", "engineer", "developer"
  ];
  const matchedExpKw = expKeywords.filter(kw => resumeLower.includes(kw));
  experienceScore = Math.min(100, Math.round((matchedExpKw.length / expKeywords.length) * 100) + 30);

  // 4. EDUCATION MATCH SCORE (Weight: 10%)
  let educationScore = 80;
  const eduKeywords = ["bachelor", "master", "phd", "degree", "bs", "ms", "computer science", "engineering", "university", "college"];
  const matchedEdu = eduKeywords.filter(kw => resumeLower.includes(kw));
  if (matchedEdu.length >= 2) {
    educationScore = 95;
  } else if (matchedEdu.length === 1) {
    educationScore = 85;
  } else {
    educationScore = 70;
  }

  // 5. FORMATTING & STRUCTURE SCORE (Weight: 10%)
  let formattingScore = 60;
  const sectionHeaders = [
    "experience", "work experience", "employment",
    "education", "academic",
    "skills", "technical skills",
    "projects", "personal projects",
    "summary", "profile", "objective"
  ];
  const detectedHeaders = sectionHeaders.filter(header => resumeLower.includes(header));
  if (detectedHeaders.length >= 4) {
    formattingScore = 95;
  } else if (detectedHeaders.length >= 2) {
    formattingScore = 80;
  } else {
    formattingScore = 70;
  }

  // OVERALL WEIGHTED ATS SCORE
  const overallScore = Math.min(
    100,
    Math.max(
      0,
      Math.round(
        skillScore * 0.35 +
        keywordScore * 0.25 +
        experienceScore * 0.20 +
        educationScore * 0.10 +
        formattingScore * 0.10
      )
    )
  );

  return {
    overallScore,
    keywordScore,
    skillScore,
    experienceScore,
    educationScore,
    formattingScore
  };
}