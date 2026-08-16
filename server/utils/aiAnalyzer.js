import dotenv from "dotenv";
dotenv.config();

export const analyzeWithGemini = async (resumeText, jobDescription, matchedSkills = [], missingSkills = []) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY missing in environment. Returning fallback AI analysis.");
      return getFallbackAnalysis(matchedSkills, missingSkills);
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: buildPrompt(resumeText, jobDescription, matchedSkills, missingSkills)
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.2
          }
        })
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini API HTTP Error:", response.status, errText);
      return getFallbackAnalysis(matchedSkills, missingSkills, "AI service temporarily unavailable.");
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      console.warn("Empty text in Gemini response candidate");
      return getFallbackAnalysis(matchedSkills, missingSkills);
    }

    // Sanitize & parse JSON
    try {
      const cleaned = rawText
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      const parsed = JSON.parse(cleaned);
      return parsed;
    } catch (parseErr) {
      console.warn("JSON parsing failed for Gemini output:", parseErr.message);
      return getFallbackAnalysis(matchedSkills, missingSkills);
    }
  } catch (err) {
    console.error("Gemini Fatal Error:", err.message);
    return getFallbackAnalysis(matchedSkills, missingSkills, "AI service temporarily unavailable.");
  }
};

const buildPrompt = (resumeText, jobDescription, matchedSkills, missingSkills) => `
You are ResumeATS AI, an expert ATS resume reviewer and career coach.

CRITICAL TRUTHFULNESS REQUIREMENT:
You MUST NOT invent, fabricate, or hallucinate skills, work experience, projects, job titles, certifications, or achievements that are absent from the candidate's resume.
If a required skill is missing, do NOT tell the user to lie or fake experience. Recommend adding it ONLY if they have genuine hands-on experience.

TASK:
Analyze the provided Resume against the Job Description.

Detected Matched Skills: ${JSON.stringify(matchedSkills)}
Detected Missing Skills: ${JSON.stringify(missingSkills)}

Return STRICT RAW JSON ONLY. Do not wrap in markdown codeblocks. Do not include extra commentary.

EXACT JSON SCHEMA:
{
  "summaryImprovement": "A concise rewritten or improved professional summary tailored to this target position.",
  "optimizationSuggestions": [
    "Actionable formatting or keyword placement advice 1",
    "Actionable suggestion 2",
    "Actionable suggestion 3"
  ],
  "bulletPointImprovements": [
    {
      "original_summary": "Summary of candidate's current project or role experience in the resume",
      "suggested_bullets": [
        "Quantifiable achievement bullet incorporating relevant keywords",
        "Action-oriented result bullet"
      ],
      "reasoning": "Why this bullet rewrite improves ATS parser visibility and recruiter impact"
    }
  ],
  "missingSkillExplanations": [
    {
      "skill": "Skill Name",
      "importance": "High",
      "explanation": "Why this skill is critical for this job description",
      "recommendation": "Recommendation on how to highlight this if experienced, or learn it if missing"
    }
  ],
  "strengths": [
    "Strength 1 found in resume",
    "Strength 2"
  ],
  "weaknesses": [
    "Area needing improvement 1",
    "Area needing improvement 2"
  ],
  "overallAssessment": "A 2-3 sentence executive evaluation of candidate fit for this role."
}

Resume Text:
${resumeText.slice(0, 4000)}

Job Description:
${jobDescription.slice(0, 4000)}
`;

function getFallbackAnalysis(matchedSkills = [], missingSkills = [], note = "") {
  return {
    summaryImprovement: "Highlight your key technical achievements and target role keywords prominently in your summary section.",
    optimizationSuggestions: [
      "Incorporate exact keyword matches from the job description in your skills and experience sections.",
      "Use standard ATS-friendly headings (Work Experience, Technical Skills, Education).",
      "Ensure bullet points start with strong action verbs and include metrics/results where applicable."
    ],
    bulletPointImprovements: [
      {
        "original_summary": "General technical projects and experience",
        "suggested_bullets": [
          "Developed scalable features utilizing core tech stack to enhance performance.",
          "Collaborated with cross-functional teams to deliver project milestones on schedule."
        ],
        "reasoning": "Action-oriented phrasing improves readability for both ATS parsers and hiring managers."
      }
    ],
    missingSkillExplanations: missingSkills.map(skill => ({
      skill,
      importance: "High",
      explanation: `Required by the job description but not detected in your resume text.`,
      recommendation: `Consider adding ${skill} only if you have genuine hands-on experience.`
    })),
    strengths: matchedSkills.length > 0 ? matchedSkills.map(s => `Strong alignment in ${s}`) : ["Relevant domain background"],
    weaknesses: missingSkills.length > 0 ? missingSkills.map(s => `Missing ${s}`) : ["Resume formatting could be sharpened"],
    overallAssessment: note || "Your resume has been analyzed. Review the skill matches and optimization tips to enhance your score."
  };
}