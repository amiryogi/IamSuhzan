import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (data) => api.post("/auth/register", data),
  getMe: () => api.get("/auth/me"),
  getProfile: () => api.get("/auth/profile"),
  updateProfile: (data) => api.put("/auth/profile", data),
  logout: () => api.get("/auth/logout"),
};

// Artworks API
export const artworksAPI = {
  getAll: (params) => api.get("/artworks", { params }),
  getFeatured: (limit = 6) =>
    api.get("/artworks/featured", { params: { limit } }),
  getById: (id) => api.get(`/artworks/${id}`),
  getBySlug: (slug) => api.get(`/artworks/slug/${slug}`),
  create: (data) => api.post("/artworks", data),
  update: (id, data) => api.put(`/artworks/${id}`, data),
  delete: (id) => api.delete(`/artworks/${id}`),
  getStats: () => api.get("/artworks/stats"),
};

// Categories API
export const categoriesAPI = {
  getAll: () => api.get("/categories"),
  getById: (id) => api.get(`/categories/${id}`),
  getBySlug: (slug) => api.get(`/categories/slug/${slug}`),
  create: (data) => api.post("/categories", data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// Messages API
export const messagesAPI = {
  getAll: () => api.get("/messages"),
  getById: (id) => api.get(`/messages/${id}`),
  updateStatus: (id, isRead) => api.put(`/messages/${id}`, { isRead }),
  delete: (id) => api.delete(`/messages/${id}`),
  send: (data) => api.post("/messages", data),
};

// Upload API
export const uploadAPI = {
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/upload/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  uploadVideo: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/upload/video", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  uploadMultiple: (files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    return api.post("/upload/multiple", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  deleteFile: (publicId, type = "image") =>
    api.delete(`/upload?publicId=${encodeURIComponent(publicId)}&type=${type}`),
};

// Hero Slides API
export const heroSlidesAPI = {
  getAll: () => api.get("/hero-slides"),
  getById: (id) => api.get(`/hero-slides/${id}`),
  create: (data) => api.post("/hero-slides", data),
  update: (id, data) => api.put(`/hero-slides/${id}`, data),
  delete: (id) => api.delete(`/hero-slides/${id}`),
  reorder: (slides) => api.put("/hero-slides/reorder", { slides }),
};

// Awards API
export const awardsAPI = {
  getAll: () => api.get("/awards"),
  getById: (id) => api.get(`/awards/${id}`),
  create: (data) => api.post("/awards", data),
  update: (id, data) => api.put(`/awards/${id}`, data),
  delete: (id) => api.delete(`/awards/${id}`),
};

export default api;
