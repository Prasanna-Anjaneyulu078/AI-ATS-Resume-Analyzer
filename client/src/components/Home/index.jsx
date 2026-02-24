// import Navbar from "../Navbar";
// import "./index.css";

// const Home = () => {
//   return (
//     <div>
//       <Navbar />
//       <div className="home-container">
//         <h1>Welcome to Resume ATS Analyzer</h1>
//         <p>Your dashboard will appear here.</p>
//       </div>
//     </div>
//   );
// };

// export default Home;
import Navbar from "../Navbar";
import "./index.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-wrapper">
      <Navbar />

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg-orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            AI-Powered Resume Analysis
          </div>
          <h1 className="hero-h1">
            Make Your Resume<br />
            <span className="gradient-text">Beat the Bots</span>
          </h1>
          <p className="hero-sub">
            Upload your resume, get an ATS score, and receive AI‑driven suggestions to make recruiters notice you.
          </p>
          <p className="hero-quote">
            "A great resume opens doors; this tool ensures it gets past the first one."
          </p>
          <div className="hero-actions">
            <button
              className="btn-primary"
              onClick={() => navigate("/your-resumes")}
            >
              Get Started — It's Free
            </button>
            <button className="btn-secondary">See Demo</button>
          </div>

          {/* Score card tease */}
          <div className="score-card-tease">
            <div className="score-ring">
              <svg viewBox="0 0 80 80" className="ring-svg">
                <circle cx="40" cy="40" r="34" className="ring-bg" />
                <circle cx="40" cy="40" r="34" className="ring-fill" />
              </svg>
              <div className="score-number">72</div>
            </div>
            <div className="score-details">
              <div className="score-label">ATS Score</div>
              <div className="score-bar-row">
                <span>Keywords</span>
                <div className="mini-bar"><div className="mini-fill" style={{width:"68%"}}></div></div>
              </div>
              <div className="score-bar-row">
                <span>Format</span>
                <div className="mini-bar"><div className="mini-fill" style={{width:"84%"}}></div></div>
              </div>
              <div className="score-bar-row">
                <span>Content</span>
                <div className="mini-bar"><div className="mini-fill" style={{width:"55%"}}></div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section">
        <div className="section-header">
          <p className="section-tag">What We Offer</p>
          <h2>Everything You Need to<br /><span className="gradient-text">Land the Interview</span></h2>
        </div>
        <div className="features-grid">
          {[
            { icon: "📄", title: "Resume Parsing", desc: "Extracts skills, experience, and education from PDF/DOCX." },
            { icon: "🎯", title: "ATS Scoring", desc: "Compares your resume to job descriptions and returns an ATS compatibility score." },
            { icon: "🤖", title: "AI Suggestions", desc: "Personalized, actionable edits and bullet rewrites powered by an LLM." },
            { icon: "🔑", title: "Keyword Optimization", desc: "Highlights missing keywords and suggests where to add them." },
            { icon: "📐", title: "Format & Layout Tips", desc: "Recommend resume sections and formatting to improve parsing." },
            { icon: "🔒", title: "Secure & Private", desc: "Files are processed securely; user accounts protect your data." },
          ].map((f, i) => (
            <div className="feature-card" key={i} style={{"--delay": `${i * 0.1}s`}}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
        <div className="features-cta">
          <button
            className="btn-primary"
            onClick={() => navigate("/your-resumes")}
          >
            Optimize my Resume
          </button>
          <p className="trust-line">No credit card. Secure processing. Export in PDF.</p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-section">
        <div className="section-header">
          <p className="section-tag">Simple Process</p>
          <h2>Three Steps to<br /><span className="gradient-text">Resume Success</span></h2>
        </div>
        <div className="steps-row">
          {[
            { num: "01", title: "Upload", desc: "Drop a PDF or DOCX of your resume." },
            { num: "02", title: "Analyze", desc: "Get an ATS score, keyword matches, and AI suggestions." },
            { num: "03", title: "Improve", desc: "Apply edits, re-run analysis, download the optimized resume." },
          ].map((s, i) => (
            <div className="step-card" key={i}>
              <div className="step-num">{s.num}</div>
              <div className="step-connector" style={{display: i < 2 ? "block" : "none"}}></div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BENEFITS */}
      <section className="benefits-section">
        <div className="benefits-text">
          <p className="section-tag">Why Choose Us</p>
          <h2>Built for<br /><span className="gradient-text">Real Results</span></h2>
          <p className="benefits-desc">
            Resume ATS Analyzer helps jobseekers pass automated screening. Upload a resume, compare it with a job description, get a clear ATS score, and receive AI-powered edits to increase your chances of getting interviews.
          </p>
          <ul className="benefits-list">
            {[
              "Increase interview invites by optimizing for ATS.",
              "Save time with instant scoring and rewrite suggestions.",
              "Improve clarity and impact of bullet points.",
              "Keep your personal data private and secure.",
            ].map((b, i) => (
              <li key={i}><span className="check-icon">✓</span>{b}</li>
            ))}
          </ul>
        </div>
        <div className="benefits-visual">
          <div className="visual-card">
            <div className="vc-header">
              <span className="vc-logo">✦ ResumeATS</span>
              <span className="vc-score-badge">92/100</span>
            </div>
            <div className="vc-section-label">CONTENT ANALYSIS</div>
            {[
              { label: "ATS Parse Rate", val: 96, color: "#00c896" },
              { label: "Keyword Match", val: 78, color: "#00A3FF" },
              { label: "Impact Score", val: 82, color: "#8b5cf6" },
              { label: "Readability", val: 91, color: "#f59e0b" },
            ].map((item, i) => (
              <div className="vc-row" key={i}>
                <span>{item.label}</span>
                <div className="vc-bar">
                  <div
                    className="vc-bar-fill"
                    style={{
                      width: `${item.val}%`,
                      background: item.color,
                      animationDelay: `${i * 0.2 + 0.5}s`,
                    }}
                  ></div>
                </div>
                <span className="vc-pct">{item.val}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="cta-section">
        <div className="cta-orb cta-orb-1"></div>
        <div className="cta-orb cta-orb-2"></div>
        <div className="cta-content">
          <h2>Ready to Get More<br /><span className="gradient-text">Interview Callbacks?</span></h2>
          <p>Join thousands of job seekers who've optimized their resumes with AI.</p>
          <div className="hero-actions">
            <button
              className="btn-primary"
              onClick={() => navigate("/your-resumes")}
            >
              Start for Free
            </button>
            <button className="btn-secondary">Learn More</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="footer-logo">✦ ResumeATS</div>
            <p>AI-powered resume optimization to help you land your dream job faster.</p>
            <div className="footer-socials">
              <a href="#" aria-label="Twitter">𝕏</a>
              <a href="#" aria-label="LinkedIn">in</a>
              <a href="#" aria-label="GitHub">⌥</a>
            </div>
          </div>
          <div className="footer-links">
            <div className="footer-col">
              <h4>Product</h4>
              <a href="#">Resume Checker</a>
              <a href="#">ATS Score</a>
              <a href="#">AI Suggestions</a>
              <a href="#">Pricing</a>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <a href="#">About Us</a>
              <a href="#">Blog</a>
              <a href="#">Careers</a>
              <a href="#">Press</a>
            </div>
            <div className="footer-col">
              <h4>Support</h4>
              <a href="#">Help Center</a>
              <a href="#">Contact</a>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 ResumeATS Analyzer. All rights reserved.</p>
          <p>Made with ❤️ for jobseekers worldwide</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;