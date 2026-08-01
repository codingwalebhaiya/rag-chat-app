import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api/v1";

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true  // MANDATORY: Sends httpOnly cookies to the backend
});

let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve();
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If the error is 401 Unauthorized and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            // Guard: don't attempt refresh if already on a login/refresh route
            if (originalRequest.url?.includes("/auth/refresh-token") || originalRequest.url?.includes("/auth/login")) {
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => api(originalRequest))
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Call refresh endpoint to rotate cookies
                await api.post("/auth/refresh-token");
                processQueue(null);
                isRefreshing = false;
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError);
                isRefreshing = false;
                return Promise.reject(refreshError);
            }
        }

        // Extract backend custom error message if available
        const message = error.response?.data?.message || error.message || "Something went wrong";
        const customError = new Error(message);

        // Attach fields matching BackendError UI interfaces
        (customError as any).success = error.response?.data?.success ?? false;
        (customError as any).statusCode = error.response?.status || 500;
        (customError as any).errors = error.response?.data?.errors || [];

        return Promise.reject(customError);
    }
);



