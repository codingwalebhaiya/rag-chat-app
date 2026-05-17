import api from "./axios";

export const refreshAccessToken = async () => {
  try {
    await api.post("/auth/refresh-token");
  } catch (error) {
    console.log("Refresh failed");
  }
};