import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  text: String,
  atsScore: Number,
  suggestions: Array
});

export default mongoose.model("Resume", resumeSchema);