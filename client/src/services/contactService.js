import api from "./api.js";

export const contactService = {
  sendContactMessage: async ({ name, email, message }) => {
    const response = await api.post("/contact", { name, email, message });
    return response.data;
  },
};
