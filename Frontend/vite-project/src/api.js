import axios from "axios";
import { store } from "./store/store"; // Adjust this path if needed

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach JWT (if you're storing it in Redux)
axiosClient.interceptors.request.use((config) => {
  const token = store.getState().auth.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handle API errors
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      return Promise.reject(
        new Error(
          error.response.data?.message ||
          error.response.data?.error ||
          `Request failed with status ${error.response.status}`
        )
      );
    }

    if (error.request) {
      return Promise.reject(
        new Error("Could not reach the server. Check your connection and try again.")
      );
    }

    return Promise.reject(error);
  }
);

// ---------- Notices ----------
export async function fetchNotices({
  category,
  keyword,
  limit = 8,
  offset = 0,
} = {}) {
  const params = { limit, offset };

  if (category) params.category = category;
  if (keyword) params.keyword = keyword;

  const response = await axiosClient.get("/notices/listNotices", { params });
  return response.data;
}

export async function fetchNoticeById(id) {
  const response = await axiosClient.get(`/notices/${id}`);
  return response.data;
}

export async function createNotice({ title, content, category }) {
  const response = await axiosClient.post(
    "/notices/createNotice",
    {
      title,
      content,
      category,
    },
    {
      withCredentials: true,
    }
  );

  return response.data;
}

// ---------- Events ----------
export async function fetchEvents({
  category,
  keyword,
  limit = 8,
  offset = 0,
} = {}) {
  const params = { limit, offset };

  if (category) params.category = category;
  if (keyword) params.keyword = keyword;

  const response = await axiosClient.get("/events/listEvents", { params });
  return response.data;
}

export async function fetchEventById(id) {
  const response = await axiosClient.get(`/events/${id}`);
  return response.data;
}

export async function createEvent({
  title,
  description,
  category,
  venue,
  startTime,
  endTime,
  organizer,
}) {
  const response = await axiosClient.post("/events/createEvent", {
    title,
    description,
    category,
    venue,
    startTime,
    endTime,
    organizer,
  },
  {
    withCredentials: true,
  });

  return response.data;
}

export default axiosClient;