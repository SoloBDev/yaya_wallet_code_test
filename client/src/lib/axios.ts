import axios from "axios";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(
      `Making ${config.method?.toUpperCase()} request to ${config.url}`
    );
    console.log(
      `Making ${config.method?.toUpperCase()} request to ${config.baseURL}${
        config.url
      }`
    );
    return config;
  },
  (error) => {
    const baseURL = import.meta.env.VITE_API_URL;
    if (!baseURL && process.env.NODE_ENV === "production") {
      throw new Error("VITE_API_URL is not defined in production");
    }
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error(
        "Response error:",
        error.response.status,
        error.response.data
      );

      // Check if response is HTML (404 page) instead of JSON
      const isHtmlResponse =
        typeof error.response.data === "string" &&
        error.response.data.includes("<!DOCTYPE html>");

      if (isHtmlResponse) {
        throw new Error(
          `API Endpoint Not Found (${error.response.status}): The requested endpoint does not exist`
        );
      }

      // Handle JSON error responses
      const errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        `HTTP ${error.response.status} Error`;

      throw new Error(`API Error: ${error.response.status} - ${errorMessage}`);
    } else if (error.request) {
      // Request made but no response received
      console.log("Network error:", error.request);
      console.log("ENDPOINT:", import.meta.env.VITE_API_URL);
      console.error("Network error:", error.request);
      throw new Error("Network error: Unable to connect to the server");
    } else {
      // Something else happened
      console.error("Error:", error.message);
      throw new Error(`Request failed: ${error.message}`);
    }
  }
);

export default apiClient;
