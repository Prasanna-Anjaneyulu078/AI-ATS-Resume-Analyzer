import { useState } from "react";
import Navbar from "../Navbar";
import { contactService } from "../../services/contactService.js";
import "./index.css";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await contactService.sendContactMessage(form);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="contact-wrapper">
      <Navbar />
      <div className="contact-bg-orbs">
        <div className="contact-orb contact-orb-1"></div>
        <div className="contact-orb contact-orb-2"></div>
      </div>

      <div className="contact-container">
        <div className="contact-header">
          <p className="contact-tag">Get in Touch</p>
          <h1 className="contact-title">
            We'd Love to <span className="gradient-text">Hear From You</span>
          </h1>
          <p className="contact-sub">
            Have a question, feedback, or just want to say hello? Fill out the form and we'll get back to you shortly.
          </p>
        </div>

        <div className="contact-card">
          {submitted ? (
            <div className="success-state">
              <div className="success-icon">✓</div>
              <h2>Contact Submitted Successfully!</h2>
              <p>Thanks for reaching out, <strong>{form.name}</strong>. Your message was delivered to <strong>support@resumeatsai.com</strong>. We'll reply to <strong>{form.email}</strong> shortly.</p>
              <button
                className="contact-btn"
                onClick={() => { setSubmitted(false); setError(""); setForm({ name: "", email: "", message: "" }); }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              {error && <div className="error-text">{error}</div>}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Jane Doe"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="jane@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Tell us what's on your mind..."
                  rows={6}
                  value={form.message}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="contact-btn" disabled={loading}>
                {loading ? "Sending Message..." : "Send Message →"}
              </button>
            </form>
          )}
        </div>

        {/* Info strip */}
        <div className="contact-info-strip">
          {[
            { icon: "✉", label: "Email", value: "support@resumeatsai.com" },
            { icon: "⏱", label: "Response Time", value: "Within 24 hours" },
            { icon: "📍", label: "Location", value: "Hyderabad, India" },
          ].map((item, i) => (
            <div className="info-item" key={i}>
              <span className="info-icon">{item.icon}</span>
              <div>
                <p className="info-label">{item.label}</p>
                <p className="info-value">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default Contact;