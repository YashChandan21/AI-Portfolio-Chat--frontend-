import axios from "axios";

const API = axios.create({
    baseURL: "https://ai-portfolio-chat-backend.onrender.com/",
});

export default API;