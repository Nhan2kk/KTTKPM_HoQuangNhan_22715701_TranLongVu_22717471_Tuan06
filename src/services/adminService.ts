import axios from "axios";

const API_URL = "http://localhost:8081/api/users/admin";

interface UserData {
  id: number;
  username: string;
  email: string;
  role: string;
  enabled: boolean;
}

interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  role: string;
}

interface UpdateUserRequest {
  email?: string;
  newPassword?: string;
}

interface ChangeRoleRequest {
  role: string;
}

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const adminService = {
  // Get all users
  getAllUsers: async (): Promise<UserData[]> => {
    try {
      const response = await axios.get(`${API_URL}/users`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  // Create new user
  createUser: async (data: CreateUserRequest): Promise<UserData> => {
    try {
      const response = await axios.post(`${API_URL}/users`, data, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  // Update user
  updateUser: async (
    id: number,
    data: UpdateUserRequest,
  ): Promise<UserData> => {
    try {
      const response = await axios.put(`${API_URL}/users/${id}`, data, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },

  // Change user role
  changeUserRole: async (id: number, role: string): Promise<UserData> => {
    try {
      const response = await axios.put(
        `${API_URL}/users/${id}/role`,
        { role },
        {
          headers: getAuthHeader(),
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error changing user role:", error);
      throw error;
    }
  },

  // Delete user
  deleteUser: async (id: number): Promise<void> => {
    try {
      await axios.delete(`${API_URL}/users/${id}`, {
        headers: getAuthHeader(),
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  },

  // Toggle user status
  toggleUserStatus: async (id: number): Promise<UserData> => {
    try {
      const response = await axios.put(
        `${API_URL}/users/${id}/toggle-status`,
        {},
        {
          headers: getAuthHeader(),
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error toggling user status:", error);
      throw error;
    }
  },
};
