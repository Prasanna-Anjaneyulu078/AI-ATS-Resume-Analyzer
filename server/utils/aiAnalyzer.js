import dotenv from "dotenv";
dotenv.config();

export const analyzeWithGemini = async (resumeText, jobDescription) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is undefined");
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
                  text: buildPrompt(resumeText, jobDescription)
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

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API Error:", data);
      throw new Error(JSON.stringify(data));
    }

    const rawText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    console.log("====== GEMINI RAW OUTPUT ======");
    console.log(rawText);
    console.log("================================");

    if (!rawText) {
      throw new Error("Empty Gemini response");
    }

    // Try parsing
    try {
      const parsed = JSON.parse(
        rawText
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim()
      );

      return parsed;

    } catch (parseError) {
      console.warn("JSON parsing failed. Returning raw model output.");
      return {
        success: false,
        raw_model_output: rawText
      };
    }

  } catch (err) {
    console.error("Gemini Fatal Error:", err.message);
    return {
      success: false,
      error: err.message
    };
  }
};


const buildPrompt = (resumeText, jobDescription) => `
You are an ATS resume analyzer.

Return STRICT JSON only.
Do not wrap in markdown.
Do not include backticks.
Do not include explanations.

Use this exact schema:

{
  "success": true,
  "analysis": {
    "resume_skills": [],
    "job_description_skills": [],
    "missing_skills": {
      "from_resume_for_job_description": [],
      "from_job_description_for_resume": []
    },
    "ats_optimized_bullet_point_improvements": [
      {
        "original_summary": "",
        "suggested_bullets": [],
        "reasoning": ""
      }
    ],
    "ats_optimization_tips": [],
    "compatibility_score": 0,
    "overall_assessment": ""
  }
}

Resume:
${resumeText}

Job Description:
${jobDescription}
`;