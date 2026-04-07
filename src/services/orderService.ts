import axios from 'axios';

const API_BASE_URL = 'http://localhost:8083/api/orders';

export interface OrderItem {
    foodId: number;
    foodName: string;
    price: number;
    quantity: number;
    notes?: string;
}

export interface CreateOrderRequest {
    userId: number;
    deliveryAddress: string;
    phoneNumber: string;
    notes?: string;
    items: OrderItem[];
}

export interface OrderResponse {
    id: number;
    userId: number;
    totalPrice: number;
    status: string;
    deliveryAddress: string;
    phoneNumber: string;
    notes?: string;
    createdAt: string;
    updatedAt?: string;
    items: OrderItemResponse[];
}

export interface OrderItemResponse {
    id: number;
    foodId: number;
    foodName: string;
    price: number;
    quantity: number;
    subtotal: number;
    notes?: string;
}

const orderService = {
    // Tạo đơn hàng mới
    createOrder: async (
        request: CreateOrderRequest,
    ): Promise<OrderResponse> => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(API_BASE_URL, request, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data.data;
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    },

    // Lấy danh sách tất cả đơn hàng
    getAllOrders: async (): Promise<OrderResponse[]> => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(API_BASE_URL, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching orders:', error);
            throw error;
        }
    },

    // Lấy chi tiết đơn hàng theo ID
    getOrderById: async (id: number): Promise<OrderResponse> => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching order:', error);
            throw error;
        }
    },

    // Lấy danh sách đơn hàng của người dùng
    getOrdersByUserId: async (userId: number): Promise<OrderResponse[]> => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching user orders:', error);
            throw error;
        }
    },

    // Cập nhật trạng thái đơn hàng
    updateOrderStatus: async (
        id: number,
        status: string,
    ): Promise<OrderResponse> => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `${API_BASE_URL}/${id}/status`,
                { status },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            return response.data.data;
        } catch (error) {
            console.error('Error updating order status:', error);
            throw error;
        }
    },

    // Hủy đơn hàng
    cancelOrder: async (id: number): Promise<OrderResponse> => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `${API_BASE_URL}/${id}/cancel`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            return response.data.data;
        } catch (error) {
            console.error('Error cancelling order:', error);
            throw error;
        }
    },

    // Xóa đơn hàng
    deleteOrder: async (id: number): Promise<void> => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_BASE_URL}/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (error) {
            console.error('Error deleting order:', error);
            throw error;
        }
    },
};

export default orderService;
