import axios from "axios";

const PAYMENT_API_BASE_URL = "http://localhost:8084/api/payments";
const NOTIFICATION_API_BASE_URL = "http://localhost:8084/api/notifications";

export interface PaymentRequest {
  orderId: number;
  userId: number;
  amount: number;
  paymentMethod: string; // COD or BANKING
  description?: string;
}

export interface PaymentResponse {
  id: number;
  orderId: number;
  userId: number;
  amount: number;
  paymentMethod: string;
  status: string;
  transactionId?: string;
  description?: string;
  createdAt: string;
  completedAt?: string;
}

export interface Notification {
  id: number;
  userId: number;
  orderId: number;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const getAuthHeader = () => {
  return {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  };
};

class PaymentService {
  // Payment methods
  createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    return axios.post(PAYMENT_API_BASE_URL, request, {
      headers: getAuthHeader(),
    });
  }

  processPayment(paymentId: number): Promise<PaymentResponse> {
    return axios.post(`${PAYMENT_API_BASE_URL}/${paymentId}/process`, {}, {
      headers: getAuthHeader(),
    });
  }

  getPayment(paymentId: number): Promise<PaymentResponse> {
    return axios.get(`${PAYMENT_API_BASE_URL}/${paymentId}`, {
      headers: getAuthHeader(),
    });
  }

  getPaymentsByUserId(userId: number): Promise<PaymentResponse[]> {
    return axios.get(`${PAYMENT_API_BASE_URL}/user/${userId}`, {
      headers: getAuthHeader(),
    });
  }

  getPaymentsByOrderId(orderId: number): Promise<PaymentResponse[]> {
    return axios.get(`${PAYMENT_API_BASE_URL}/order/${orderId}`, {
      headers: getAuthHeader(),
    });
  }

  cancelPayment(paymentId: number): Promise<PaymentResponse> {
    return axios.put(`${PAYMENT_API_BASE_URL}/${paymentId}/cancel`, {}, {
      headers: getAuthHeader(),
    });
  }

  // Notification methods
  getNotificationsByUserId(userId: number): Promise<Notification[]> {
    return axios.get(`${NOTIFICATION_API_BASE_URL}/user/${userId}`, {
      headers: getAuthHeader(),
    });
  }

  getUnreadNotifications(userId: number): Promise<Notification[]> {
    return axios.get(`${NOTIFICATION_API_BASE_URL}/user/${userId}/unread`, {
      headers: getAuthHeader(),
    });
  }

  getNotificationsByOrderId(orderId: number): Promise<Notification[]> {
    return axios.get(`${NOTIFICATION_API_BASE_URL}/order/${orderId}`, {
      headers: getAuthHeader(),
    });
  }

  getNotification(notificationId: number): Promise<Notification> {
    return axios.get(`${NOTIFICATION_API_BASE_URL}/${notificationId}`, {
      headers: getAuthHeader(),
    });
  }

  markAsRead(notificationId: number): Promise<Notification> {
    return axios.put(`${NOTIFICATION_API_BASE_URL}/${notificationId}/read`, {}, {
      headers: getAuthHeader(),
    });
  }

  markAllAsRead(userId: number): Promise<void> {
    return axios.put(`${NOTIFICATION_API_BASE_URL}/user/${userId}/read-all`, {}, {
      headers: getAuthHeader(),
    });
  }
}

export default new PaymentService();
