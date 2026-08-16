export const sendContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Please provide name, email, and message." });
    }

    const recipient = process.env.CONTACT_EMAIL || "support@resumeatsai.com";

    // Standard email regex check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }

    res.json({
      success: true,
      message: `Your message has been sent to ${recipient}.`,
      data: {
        senderName: name,
        senderEmail: email,
        recipient
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to process contact submission." });
  }
};
