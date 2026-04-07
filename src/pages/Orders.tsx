import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import orderService from '../services/orderService';
import authService from '../services/authService';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/orders.css';

interface Order {
    id: number;
    userId: number;
    totalPrice: number;
    status: string;
    deliveryAddress: string;
    phoneNumber: string;
    notes?: string;
    createdAt: string;
    items: OrderItem[];
}

interface OrderItem {
    id: number;
    foodId: number;
    foodName: string;
    price: number;
    quantity: number;
    subtotal: number;
}

export default function Orders() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const user = authService.getUser();
            if (!user || !user.id) {
                setError('Vui lòng đăng nhập');
                navigate('/login');
                return;
            }

            const userOrders = await orderService.getOrdersByUserId(user.id);
            setOrders(userOrders);
            setError('');
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError('Không thể tải danh sách đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async (id: number) => {
        if (!confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
            return;
        }

        try {
            await orderService.cancelOrder(id);
            alert('✅ Đơn hàng đã bị hủy');
            fetchOrders();
        } catch (err) {
            alert('❌ Không thể hủy đơn hàng');
        }
    };

    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, { label: string; className: string }> =
            {
                PENDING: { label: '⏳ Chờ xử lý', className: 'status-pending' },
                CONFIRMED: {
                    label: '✓ Đã xác nhận',
                    className: 'status-confirmed',
                },
                PREPARING: {
                    label: '👨‍🍳 Đang chuẩn bị',
                    className: 'status-preparing',
                },
                READY: { label: '📦 Sẵn sàng giao', className: 'status-ready' },
                DELIVERING: {
                    label: '🚚 Đang giao',
                    className: 'status-delivering',
                },
                COMPLETED: {
                    label: '✅ Hoàn thành',
                    className: 'status-completed',
                },
                CANCELLED: {
                    label: '❌ Đã hủy',
                    className: 'status-cancelled',
                },
            };

        const mapping = statusMap[status] || {
            label: status,
            className: 'status-unknown',
        };
        return (
            <span className={`status-badge ${mapping.className}`}>
                {mapping.label}
            </span>
        );
    };

    return (
        <>
            <Header />
            <div className="orders-container">
                <div className="orders-header">
                    <h1>📋 Lịch sử đơn hàng</h1>
                    <button
                        onClick={() => navigate('/food')}
                        className="btn btn-back"
                    >
                        ← Quay lại menu
                    </button>
                </div>

                {loading ? (
                    <div className="loading">Đang tải...</div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : orders.length === 0 ? (
                    <div className="empty-orders">
                        <p>😢 Bạn chưa có đơn hàng nào</p>
                        <button
                            onClick={() => navigate('/food')}
                            className="btn btn-primary"
                        >
                            Đặt hàng ngay
                        </button>
                    </div>
                ) : (
                    <div className="orders-list">
                        {orders.map((order) => (
                            <div key={order.id} className="order-card">
                                <div className="order-header">
                                    <div className="order-info">
                                        <h3>Đơn hàng #{order.id}</h3>
                                        <p className="order-date">
                                            {new Date(
                                                order.createdAt,
                                            ).toLocaleString('vi-VN')}
                                        </p>
                                    </div>
                                    {getStatusBadge(order.status)}
                                </div>

                                <div className="order-body">
                                    <div className="order-section">
                                        <h4>Thông tin giao hàng</h4>
                                        <p>
                                            <strong>Địa chỉ:</strong>{' '}
                                            {order.deliveryAddress}
                                        </p>
                                        <p>
                                            <strong>Điện thoại:</strong>{' '}
                                            {order.phoneNumber}
                                        </p>
                                        {order.notes && (
                                            <p>
                                                <strong>Ghi chú:</strong>{' '}
                                                {order.notes}
                                            </p>
                                        )}
                                    </div>

                                    <div className="order-section">
                                        <h4>Các món trong đơn</h4>
                                        <table className="items-table">
                                            <thead>
                                                <tr>
                                                    <th>Tên món</th>
                                                    <th>Giá</th>
                                                    <th>Số lượng</th>
                                                    <th>Thành tiền</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {order.items.map((item) => (
                                                    <tr key={item.id}>
                                                        <td>{item.foodName}</td>
                                                        <td>
                                                            {item.price.toLocaleString(
                                                                'vi-VN',
                                                            )}{' '}
                                                            VNĐ
                                                        </td>
                                                        <td>{item.quantity}</td>
                                                        <td>
                                                            {item.subtotal.toLocaleString(
                                                                'vi-VN',
                                                            )}{' '}
                                                            VNĐ
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="order-total">
                                        <strong>Tổng tiền:</strong>
                                        <span className="total-price">
                                            {order.totalPrice.toLocaleString(
                                                'vi-VN',
                                            )}{' '}
                                            VNĐ
                                        </span>
                                    </div>
                                </div>

                                <div className="order-actions">
                                    {order.status !== 'COMPLETED' &&
                                        order.status !== 'CANCELLED' && (
                                            <button
                                                onClick={() =>
                                                    handleCancelOrder(order.id)
                                                }
                                                className="btn btn-cancel"
                                            >
                                                ❌ Hủy đơn
                                            </button>
                                        )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}
