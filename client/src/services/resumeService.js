import api from "./api.js";

export const resumeService = {
  uploadResume: async (formData) => {
    const response = await api.post("/resume/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  analyzeResume: async (resumeText, jobDescription) => {
    const response = await api.post("/resume/analyze", {
      resumeText,
      jobDescription,
    });
    return response.data;
  },
};
