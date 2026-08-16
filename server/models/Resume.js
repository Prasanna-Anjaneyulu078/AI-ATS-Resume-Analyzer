import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    filename: {
      type: String,
      default: "resume.pdf",
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    jobTitle: {
      type: String,
      default: "",
    },
    companyName: {
      type: String,
      default: "",
    },
    jobDescription: {
      type: String,
      required: true,
    },
    resumeText: {
      type: String,
      required: true,
    },
    atsScore: {
      type: Number,
      required: true,
      default: 0,
    },
    scoreBreakdown: {
      overallScore: { type: Number, default: 0 },
      keywordScore: { type: Number, default: 0 },
      skillScore: { type: Number, default: 0 },
      experienceScore: { type: Number, default: 0 },
      educationScore: { type: Number, default: 0 },
      formattingScore: { type: Number, default: 0 },
    },
    matchedSkills: {
      type: [String],
      default: [],
    },
    missingSkills: {
      type: [String],
      default: [],
    },
    partialMatches: {
      type: [String],
      default: [],
    },
    aiSuggestions: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

export default mongoose.model("Resume", resumeSchema);