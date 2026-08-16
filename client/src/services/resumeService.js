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

  analyzeResume: async (data) => {
    // Check if data is FormData (multipart) or plain object (json)
    const isFormData = data instanceof FormData;
    const response = await api.post("/resume/analyze", data, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : { "Content-Type": "application/json" },
    });
    return response.data;
  },

  getHistory: async () => {
    const response = await api.get("/resume/history");
    return response.data;
  },

  deleteResume: async (id) => {
    const response = await api.delete(`/resume/${id}`);
    return response.data;
  },
};
