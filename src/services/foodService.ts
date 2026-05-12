import axios from "axios";

const API_BASE_URL = "http://localhost:8082/api/foods";

export interface Food {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category?: string;
  available: boolean;
}

class FoodService {
  getAllFoods(): Promise<Food[]> {
    return axios.get(API_BASE_URL);
  }

  getFoodById(id: number): Promise<Food> {
    return axios.get(`${API_BASE_URL}/${id}`);
  }

  searchFoods(keyword: string): Promise<Food[]> {
    return axios.get(`${API_BASE_URL}/search`, {
      params: { keyword },
    });
  }

  getFoodsByCategory(category: string): Promise<Food[]> {
    return axios.get(`${API_BASE_URL}/category/${category}`);
  }

  createFood(food: Omit<Food, "id">): Promise<Food> {
    return axios.post(API_BASE_URL, food, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  }

  updateFood(id: number, food: Partial<Food>): Promise<Food> {
    return axios.put(`${API_BASE_URL}/${id}`, food, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  }

  deleteFood(id: number): Promise<void> {
    return axios.delete(`${API_BASE_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  }
}

export default new FoodService();
export { Food };
