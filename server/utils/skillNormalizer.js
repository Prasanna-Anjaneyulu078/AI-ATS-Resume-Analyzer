/**
 * Skill Normalizer Utility
 * Maps skill variations, synonyms, and aliases to canonical standardized skill names.
 */

// Skill Dictionary Mapping: alias (lowercase) -> Canonical Name
const SKILL_MAP = new Map([
  // Languages
  ["js", "JavaScript"],
  ["javascript", "JavaScript"],
  ["ecmascript", "JavaScript"],
  ["ts", "TypeScript"],
  ["typescript", "TypeScript"],
  ["py", "Python"],
  ["python", "Python"],
  ["java", "Java"],
  ["cpp", "C++"],
  ["c++", "C++"],
  ["cs", "C#"],
  ["c#", "C#"],
  ["c sharp", "C#"],
  ["golang", "Go"],
  ["go", "Go"],
  ["ruby", "Ruby"],
  ["php", "PHP"],
  ["swift", "Swift"],
  ["kotlin", "Kotlin"],
  ["rust", "Rust"],
  ["sql", "SQL"],
  ["html", "HTML5"],
  ["html5", "HTML5"],
  ["css", "CSS3"],
  ["css3", "CSS3"],
  ["sass", "Sass"],
  ["scss", "Sass"],

  // Frontend Frameworks & Libraries
  ["react", "React"],
  ["reactjs", "React"],
  ["react.js", "React"],
  ["vue", "Vue.js"],
  ["vuejs", "Vue.js"],
  ["vue.js", "Vue.js"],
  ["angular", "Angular"],
  ["angularjs", "Angular"],
  ["nextjs", "Next.js"],
  ["next.js", "Next.js"],
  ["redux", "Redux"],
  ["tailwind", "Tailwind CSS"],
  ["tailwindcss", "Tailwind CSS"],
  ["bootstrap", "Bootstrap"],

  // Backend & Runtime
  ["node", "Node.js"],
  ["nodejs", "Node.js"],
  ["node.js", "Node.js"],
  ["express", "Express.js"],
  ["expressjs", "Express.js"],
  ["express.js", "Express.js"],
  ["nestjs", "NestJS"],
  ["nest.js", "NestJS"],
  ["spring", "Spring Boot"],
  ["spring boot", "Spring Boot"],
  ["django", "Django"],
  ["flask", "Flask"],
  ["fastapi", "FastAPI"],
  ["laravel", "Laravel"],
  ["asp.net", "ASP.NET"],
  [".net", ".NET"],

  // Databases & Storage
  ["postgres", "PostgreSQL"],
  ["postgresql", "PostgreSQL"],
  ["postgresql database", "PostgreSQL"],
  ["mongo", "MongoDB"],
  ["mongodb", "MongoDB"],
  ["mongo db", "MongoDB"],
  ["mysql", "MySQL"],
  ["sqlite", "SQLite"],
  ["redis", "Redis"],
  ["oracle", "Oracle DB"],
  ["dynamodb", "DynamoDB"],
  ["cassandra", "Cassandra"],

  // Cloud & DevOps
  ["aws", "AWS"],
  ["amazon web services", "AWS"],
  ["gcp", "GCP"],
  ["google cloud", "GCP"],
  ["google cloud platform", "GCP"],
  ["azure", "Microsoft Azure"],
  ["microsoft azure", "Microsoft Azure"],
  ["docker", "Docker"],
  ["docker container", "Docker"],
  ["k8s", "Kubernetes"],
  ["kubernetes", "Kubernetes"],
  ["ci/cd", "CI/CD"],
  ["cicd", "CI/CD"],
  ["continuous integration", "CI/CD"],
  ["terraform", "Terraform"],
  ["ansible", "Ansible"],
  ["linux", "Linux"],
  ["bash", "Bash"],

  // Architectures & Concepts
  ["rest api", "REST API"],
  ["rest apis", "REST API"],
  ["restful api", "REST API"],
  ["restful apis", "REST API"],
  ["restful web services", "REST API"],
  ["graphql", "GraphQL"],
  ["grpc", "gRPC"],
  ["microservices", "Microservices"],
  ["microservice", "Microservices"],
  ["microservice architecture", "Microservices"],
  ["object oriented programming", "OOP"],
  ["oop", "OOP"],
  ["design patterns", "Design Patterns"],

  // Tools & Testing
  ["git", "Git"],
  ["github", "GitHub"],
  ["gitlab", "GitLab"],
  ["jira", "Jira"],
  ["jest", "Jest"],
  ["cypress", "Cypress"],
  ["junit", "JUnit"],
  ["postman", "Postman"],
  ["webpack", "Webpack"],
  ["vite", "Vite"]
]);

/**
 * Normalizes a single skill string if present in our dictionary,
 * otherwise returns the original trimmed/capitalized string.
 */
export function normalizeSkill(skill) {
  if (!skill || typeof skill !== "string") return "";
  const cleaned = skill.trim().toLowerCase();
  if (SKILL_MAP.has(cleaned)) {
    return SKILL_MAP.get(cleaned);
  }
  // Title-case fallback
  return skill
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Extracts and normalizes skills from a given text.
 */
export function extractNormalizedSkills(text) {
  if (!text || typeof text !== "string") return [];
  const lowerText = text.toLowerCase();
  const matchedSkills = new Set();

  for (const [alias, canonicalName] of SKILL_MAP.entries()) {
    // Escape special chars for regex (e.g. c++, c#, .net)
    const escaped = alias.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    // Use word boundaries when appropriate, handle symbols like c++ or .net
    const pattern = new RegExp(`(?:^|[^a-zA-Z0-9_])${escaped}(?:$|[^a-zA-Z0-9_])`, "i");
    if (pattern.test(lowerText)) {
      matchedSkills.add(canonicalName);
    }
  }

  return Array.from(matchedSkills);
}
