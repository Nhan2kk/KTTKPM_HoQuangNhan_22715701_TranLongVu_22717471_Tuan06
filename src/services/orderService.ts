import axios from "axios";

const API_BASE_URL = "http://localhost:8083/api/orders";

export interface OrderItem {
  foodId: number;
  quantity: number;
  price: number;
}

export interface CreateOrderRequest {
  userId: number;
  items: OrderItem[];
  deliveryAddress: string;
  phoneNumber: string;
  notes?: string;
}

export interface OrderResponse {
  id: number;
  userId: number;
  totalPrice: number;
  status: string;
  deliveryAddress: string;
  phoneNumber: string;
  notes?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt?: string;
}

class OrderService {
  createOrder(request: CreateOrderRequest): Promise<OrderResponse> {
    return axios.post(API_BASE_URL, request, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
  }

  getAllOrders(): Promise<OrderResponse[]> {
    return axios.get(API_BASE_URL, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  }

  getOrderById(id: number): Promise<OrderResponse> {
    return axios.get(`${API_BASE_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  }

  getOrdersByUserId(userId: number): Promise<OrderResponse[]> {
    return axios.get(`${API_BASE_URL}/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  }

  updateOrderStatus(id: number, status: string): Promise<OrderResponse> {
    return axios.put(
      `${API_BASE_URL}/${id}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
  }

  cancelOrder(id: number): Promise<OrderResponse> {
    return axios.put(
      `${API_BASE_URL}/${id}/cancel`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
  }
}

export default new OrderService();
