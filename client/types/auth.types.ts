
export type UserRole = "USER" | "ADMIN";

export interface User {
  id: string;
  username: string;
  email: string;
  role?: UserRole;
  isVerified?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}

