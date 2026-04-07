import axios from 'axios';

const API_BASE_URL = 'http://localhost:8082/api/foods';

export interface Food {
    id?: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
    available: boolean;
}

export interface CartItem extends Food {
    quantity: number;
}

const foodService = {
    // Lấy danh sách tất cả món ăn
    getAllFoods: async (): Promise<Food[]> => {
        try {
            const response = await axios.get(API_BASE_URL);
            return response.data;
        } catch (error) {
            console.error('Error fetching foods:', error);
            throw error;
        }
    },

    // Lấy chi tiết món ăn theo ID
    getFoodById: async (id: number): Promise<Food> => {
        try {
            const response = await axios.get(`${API_BASE_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching food:', error);
            throw error;
        }
    },

    // Thêm món ăn mới
    createFood: async (food: Food): Promise<Food> => {
        try {
            const response = await axios.post(API_BASE_URL, food);
            return response.data;
        } catch (error) {
            console.error('Error creating food:', error);
            throw error;
        }
    },

    // Cập nhật món ăn
    updateFood: async (id: number, food: Food): Promise<Food> => {
        try {
            const response = await axios.put(`${API_BASE_URL}/${id}`, food);
            return response.data;
        } catch (error) {
            console.error('Error updating food:', error);
            throw error;
        }
    },

    // Xóa món ăn
    deleteFood: async (id: number): Promise<void> => {
        try {
            await axios.delete(`${API_BASE_URL}/${id}`);
        } catch (error) {
            console.error('Error deleting food:', error);
            throw error;
        }
    },

    // Tìm kiếm món ăn theo tên
    searchFoods: async (keyword: string): Promise<Food[]> => {
        try {
            const response = await axios.get(`${API_BASE_URL}/search`, {
                params: { keyword },
            });
            return response.data;
        } catch (error) {
            console.error('Error searching foods:', error);
            throw error;
        }
    },

    // Lọc món ăn theo danh mục
    getFoodsByCategory: async (category: string): Promise<Food[]> => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/category/${category}`,
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching foods by category:', error);
            throw error;
        }
    },
};

export default foodService;
