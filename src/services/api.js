import axios from "axios";

const API = axios.create({
  baseURL: "https://ai-portfolio-chat-backend.onrender.com" || "http://localhost:8000",
  timeout: 30000,
});

export default API;