import axios from "axios";

const API = axios.create({
  baseURL: "https://ticket-system-backend-y8xs.onrender.com/api",
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth APIs
export const registerUser = (data) => API.post("/users/register", data);
export const loginUser = (data) => API.post("/users/login", data);
export const getUserProfile = () => API.get("/users/profile");
export const updateUserProfile = (data) => API.put("/users/profile", data);

// Ticket APIs
export const getAllTickets = () => API.get("/tickets");
export const getTicketDetails = (id) => API.get(`/tickets/${id}`);
export const createTicket = (data) => API.post("/tickets", data);
export const updateTicket = (id, data) => API.put(`/tickets/${id}`, data);
export const deleteTicket = (id) => API.delete(`/tickets/${id}`);
export const getUserTickets = (userId) => API.get(`/tickets/user/${userId}`);

// Comment APIs
export const getComments = (ticketId) => API.get(`/comments/${ticketId}`);
export const createComment = (data) => API.post("/comments", data);
