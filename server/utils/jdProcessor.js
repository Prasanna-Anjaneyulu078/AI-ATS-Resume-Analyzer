import { extractNormalizedSkills } from "./skillNormalizer.js";

/**
 * Job Description Processing Utility
 * Extracts structured job metadata from raw Job Description text.
 */
export function processJobDescription(jobDescription, jobTitle = "", companyName = "") {
  if (!jobDescription || typeof jobDescription !== "string") {
    return {
      jobTitle: jobTitle || "Software Engineer",
      companyName: companyName || "",
      requiredSkills: [],
      programmingLanguages: [],
      frameworks: [],
      databases: [],
      cloudTechnologies: [],
      tools: [],
      softSkills: [],
      educationKeywords: [],
      experienceKeywords: [],
      keywords: []
    };
  }

  // 1. Extract normalized technical skills
  const normalizedSkills = extractNormalizedSkills(jobDescription);

  // Categorize skills
  const languages = ["JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Go", "Ruby", "PHP", "Swift", "Kotlin", "Rust", "SQL", "HTML5", "CSS3"];
  const frameworks = ["React", "Vue.js", "Angular", "Next.js", "Redux", "Tailwind CSS", "Bootstrap", "Node.js", "Express.js", "NestJS", "Spring Boot", "Django", "Flask", "FastAPI", "Laravel", "ASP.NET", ".NET"];
  const databases = ["PostgreSQL", "MongoDB", "MySQL", "SQLite", "Redis", "Oracle DB", "DynamoDB", "Cassandra"];
  const cloudTech = ["AWS", "GCP", "Microsoft Azure", "Docker", "Kubernetes", "CI/CD", "Terraform", "Ansible"];
  const tools = ["Git", "GitHub", "GitLab", "Jira", "Jest", "Cypress", "JUnit", "Postman", "Webpack", "Vite", "Linux", "Bash"];

  const programmingLanguages = normalizedSkills.filter(s => languages.includes(s));
  const detectedFrameworks = normalizedSkills.filter(s => frameworks.includes(s));
  const detectedDatabases = normalizedSkills.filter(s => databases.includes(s));
  const detectedCloud = normalizedSkills.filter(s => cloudTech.includes(s));
  const detectedTools = normalizedSkills.filter(s => tools.includes(s));

  // 2. Soft skills extraction
  const softSkillTerms = [
    "communication", "leadership", "problem solving", "teamwork", "collaboration",
    "critical thinking", "adaptability", "time management", "agile", "scrum", "mentorship"
  ];
  const lowerJD = jobDescription.toLowerCase();
  const softSkills = softSkillTerms
    .filter(term => lowerJD.includes(term))
    .map(term => term.charAt(0).toUpperCase() + term.slice(1));

  // 3. Education requirements
  const eduTerms = ["bachelor", "master", "phd", "degree", "computer science", "engineering", "information technology"];
  const educationKeywords = eduTerms.filter(term => lowerJD.includes(term));

  // 4. Experience requirements
  const expMatch = lowerJD.match(/(\d+\+?\s*(?:-\s*\d+)?\s*(?:years?|yrs?))/i);
  const experienceRequirement = expMatch ? expMatch[0] : "";

  // 5. Keyword extraction (unique words >= 3 chars, omitting common stop words)
  const stopWords = new Set([
    "and", "the", "for", "with", "that", "this", "from", "you", "will", "are", "have", "been",
    "work", "team", "years", "experience", "role", "looking", "candidate", "ability", "must", "should"
  ]);

  const rawWords = jobDescription
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(w => w.length >= 3 && !stopWords.has(w));

  const keywords = [...new Set(rawWords)].slice(0, 50);

  return {
    jobTitle: jobTitle.trim() || "Target Role",
    companyName: companyName.trim() || "",
    requiredSkills: normalizedSkills,
    programmingLanguages,
    frameworks: detectedFrameworks,
    databases: detectedDatabases,
    cloudTechnologies: detectedCloud,
    tools: detectedTools,
    softSkills,
    educationKeywords,
    experienceRequirement,
    keywords
  };
}
