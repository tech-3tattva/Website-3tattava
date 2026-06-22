import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({
  baseURL: API,
  headers: { "Content-Type": "application/json" },
});

export const getProducts = (params) => api.get("/products", { params }).then((r) => r.data);
export const getProduct = (slug) => api.get(`/products/${slug}`).then((r) => r.data);
export const getDoctors = () => api.get("/doctors").then((r) => r.data);
export const getDoctor = (slug) => api.get(`/doctors/${slug}`).then((r) => r.data);
export const bookDoctor = (b) => api.post("/doctors/book", b).then((r) => r.data);
export const getKnowledge = (params) => api.get("/knowledge", { params }).then((r) => r.data);
export const getArticle = (slug) => api.get(`/knowledge/${slug}`).then((r) => r.data);
export const getLocations = () => api.get("/locations").then((r) => r.data);
export const subscribeNewsletter = (payload) => api.post("/newsletter", payload).then((r) => r.data);
export const submitLead = (payload) => api.post("/leads", payload).then((r) => r.data);
export const submitAssessment = (payload) => api.post("/assessment", payload).then((r) => r.data);
export const submitDoshaQuiz = (payload) => api.post("/dosha-quiz", payload).then((r) => r.data);
export const submitContact = (payload) => api.post("/contact", payload).then((r) => r.data);
export const createOrder = (payload) => api.post("/orders", payload).then((r) => r.data);
export const getOrder = (id) => api.get(`/orders/${id}`).then((r) => r.data);
