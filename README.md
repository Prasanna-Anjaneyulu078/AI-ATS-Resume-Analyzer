# AI ATS Resume Analyzer

An AI-powered full-stack web application that analyzes resumes against job descriptions, calculates ATS compatibility scores, and provides structured optimization suggestions.

Built using the MERN stack with AI integration.

---

# Problem Statement

Many resumes are rejected by Applicant Tracking Systems (ATS) before reaching human recruiters due to poor keyword alignment and formatting issues.

This application simulates real-world ATS screening by:

- Extracting text from uploaded resumes (PDF)
- Matching keywords with job descriptions
- Calculating compatibility scores
- Generating AI-powered improvement suggestions

---

# System Architecture

User  
↓  
React Frontend (Vite SPA)  
↓  
Express REST API  
↓  
JWT Authentication Middleware  
↓  
Resume Parser  
↓  
Keyword Extractor  
↓  
ATS Scoring Engine  
↓  
Gemini AI Analyzer  
↓  
MongoDB Database  

---

# Complete Workflow

## Authentication Flow

- User registers (`POST /register`)
- User logs in (`POST /login`)
- Backend generates JWT
- Token required for protected routes:
  - `/upload`
  - `/analyze`

---

## Resume Upload & Parsing

- Resume uploaded via Multer (memory storage)
- Buffer converted to `Uint8Array`
- PDF parsed using `pdfjs-dist`
- Multi-page text extracted and concatenated

---

## ATS Scoring Logic

- Keywords extracted from:
  - Resume
  - Job description
- Duplicate JD keywords removed
- Score calculated:

ATS Score = (Matched Keywords / Unique JD Keywords) × 100

- Rounded percentage returned

---

## AI-Powered Analysis

Integrated with Google Gemini API (`gemini-2.5-flash` model).

Returns structured JSON:

- Resume skills
- Job description skills
- Missing skills
- Bullet point improvements
- Optimization tips
- Compatibility score
- Overall assessment

Strict JSON parsing enforced for reliability.

---

## Data Persistence

Resume analysis stored in MongoDB:

- userId
- resume text
- ATS score
- AI suggestions

Allows historical tracking of resume improvements.

---

# Tech Stack

## Frontend
- React (Vite)
- React Router
- Axios

## Backend
- Node.js
- Express.js
- JSON Web Token (JWT)
- Multer
- pdfjs-dist

## Database
- MongoDB (Mongoose)

## AI Integration
- Google Gemini API

---

# 📂 Project Structure

client/
  ├── components/
  ├── YourResumes/
  └── App.jsx

server/
  ├── controllers/
  ├── middleware/
  ├── models/
  ├── routes/
  └── utils/

---

# ⚙️ Installation

## 1. Clone Repository
git clone <https://github.com/Prasanna-Anjaneyulu078/AI-ATS-Resume-Analyzer.git>

## 2. Install Dependencies

### Client
cd client  
npm install  
npm run dev  

### Server
cd server  
npm install  
npm run dev  

## 3. Environment Variables (`server/.env`)

PORT=5000  
MONGO_URI=your_mongodb_uri  
JWT_SECRET=your_secret_key  
GEMINI_API_KEY=your_gemini_api_key  

---

# What This Project Demonstrates

- Full-stack MERN architecture
- REST API design
- JWT-based authentication
- File handling & PDF parsing in Node.js
- Custom ATS scoring algorithm
- AI API integration
- Modular backend structure
- Separation of concerns (Routes / Controllers / Middleware / Services)

---

# Future Improvements

- Password hashing using bcrypt
- Role-based access control
- Resume template generator
- Analytics dashboard
- Cloud file storage integration
- Resume version comparison

---

# Conclusion

This project demonstrates the ability to:

- Design a secure authentication system
- Handle document processing workflows
- Implement algorithmic scoring logic
- Integrate external AI services
- Build a scalable, modular backend architecture

It reflects production-style full-stack development practices.
