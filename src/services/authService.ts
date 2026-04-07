
import axios from "axios";

const API_BASE_URL = 'http://172.28.41.112:8081/api/users';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
    role: string;
    active: boolean;
    createdAt: number;
  };
  message: string;
}

class AuthService {
  login(credentials: LoginRequest): Promise<AuthResponse> {
    return axios.post(`${API_BASE_URL}/login`, credentials, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  register(data: RegisterRequest): Promise<AuthResponse> {
    return axios.post(`${API_BASE_URL}/register`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem("token");
  }

  getToken(): string | null {
    return localStorage.getItem("token");
  }

  getUser(): any {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }

  setToken(token: string): void {
    localStorage.setItem("token", token);
  }

  setUser(user: any): void {
    localStorage.setItem("user", JSON.stringify(user));
  }
}

export default new AuthService();
