export interface User {
  id: string;
  name?: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  isVerified: boolean;
  createdAt: string; // ISO Date strings from API JSON
  updatedAt: string;
}

/**
 * Standard API Wrapper Structure for clean error and data handling.
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

/**
 * Authentication API Specific Responses
 */
export interface AuthResponseData {
  user: User;
  accessToken: string;
}

export type AuthApiResponse = ApiResponse<AuthResponseData>;