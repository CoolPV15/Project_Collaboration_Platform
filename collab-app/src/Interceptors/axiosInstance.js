import axios from "axios";

// Create an axios instance with default config
const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/api/", // Base API URL
  headers: {
    // If there's an access_token in localStorage, attach it to the request
    Authorization: localStorage.getItem("access_token")
      ? `Bearer ${localStorage.getItem("access_token")}`
      : null,
    "Content-Type": "application/json", // Sending JSON data
    accept: "application/json",         // Accept JSON responses
  },
});

// Flags & queue for handling multiple requests during token refresh
let isRefreshing = false;
let failedQueue = [];

// Helper function to resolve/reject queued requests
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);  // If refresh failed, reject request
    } else {
      prom.resolve(token); // If refresh succeeded, retry with new token
    }
  });
  failedQueue = []; // Clear queue after processing
};

// Interceptor: Handles API responses and errors globally
axiosInstance.interceptors.response.use(
  (response) => response, // If response is fine, just return it

  async (error) => {
    const originalRequest = error.config;

    // If unauthorized (401) and this is not a retried request
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If another refresh is already happening, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            // Retry the original request with the new token
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      // Mark this request as a retry attempt
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh token
        const response = await axios.post("http://127.0.0.1:8000/api/token/refresh/", {
          refresh: localStorage.getItem("refresh_token"),
        });

        // Save new tokens
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);

        // Update axios default headers with new access token
        axiosInstance.defaults.headers["Authorization"] = "Bearer " + response.data.access;

        // Resolve queued requests with the new token
        processQueue(null, response.data.access);

        // Retry the failed request with new token
        originalRequest.headers["Authorization"] = "Bearer " + response.data.access;
        return axiosInstance(originalRequest);

      } catch (err) {
        // If refresh failed, then clear tokens & redirect to login
        processQueue(err, null);
        console.error("Refresh token failed. User needs to log in again.", err);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/";
        return Promise.reject(err);

      } finally {
        isRefreshing = false; // Reset flag whether success or fail
      }
    }

    // If error is not 401, reject normally
    return Promise.reject(error);
  }
);

export default axiosInstance;