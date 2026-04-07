import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Food } from '../services/foodService';
import orderService from '../services/orderService';
import authService from '../services/authService';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/cart.css';

interface CartItem extends Food {
    quantity: number;
}

function Cart() {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState<CartItem[]>(() => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        return cart;
    });
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const sum = cartItems.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0,
        );
        setTotal(sum);
    }, [cartItems]);

    const updateQuantity = (id: number | undefined, quantity: number) => {
        if (!id) return;
        if (quantity <= 0) {
            removeItem(id);
            return;
        }

        const updated = cartItems.map((item) =>
            item.id === id ? { ...item, quantity } : item,
        );
        setCartItems(updated);
        localStorage.setItem('cart', JSON.stringify(updated));
    };

    const removeItem = (id: number | undefined) => {
        if (!id) return;
        const updated = cartItems.filter((item) => item.id !== id);
        setCartItems(updated);
        localStorage.setItem('cart', JSON.stringify(updated));
    };

    const clearCart = () => {
        if (confirm('Bạn có chắc chắn muốn xóa tất cả?')) {
            setCartItems([]);
            localStorage.removeItem('cart');
        }
    };

    const handleCheckout = async () => {
        try {
            const user = authService.getUser();
            if (!user || !user.id) {
                alert('Vui lòng đăng nhập trước');
                navigate('/login');
                return;
            }

            // Validate cart items
            if (cartItems.length === 0) {
                alert('Giỏ hàng trống');
                return;
            }

            // Get delivery info
            const deliveryAddress = prompt('Địa chỉ giao hàng:');
            if (!deliveryAddress) {
                return;
            }

            const phoneNumber = prompt('Số điện thoại:');
            if (!phoneNumber) {
                return;
            }

            const notes = prompt('Ghi chú (không bắt buộc):') || '';

            // Prepare order request
            const orderRequest = {
                userId: user.id,
                deliveryAddress: deliveryAddress,
                phoneNumber: phoneNumber,
                notes: notes,
                items: cartItems.map((item) => ({
                    foodId: item.id,
                    foodName: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    notes: '',
                })),
            };

            // Create order
            const response = await orderService.createOrder(orderRequest);
            alert(
                `✅ Đơn hàng tạo thành công! ID: ${response.id}\nTổng tiền: ${response.totalPrice.toLocaleString('vi-VN')} VNĐ`,
            );
            clearCart();
            navigate('/food');
        } catch (error: any) {
            console.error('Error creating order:', error);
            alert(
                `❌ Lỗi: ${error.response?.data?.error || error.message || 'Không thể tạo đơn hàng'}`,
            );
        }
    };

    return (
        <>
            <Header />
            <div className="cart-container">
                <div className="cart-header">
                    <h1>🛒 Giỏ hàng của bạn</h1>
                    <button
                        onClick={() => navigate('/food')}
                        className="btn btn-back-to-shop"
                    >
                        ← Tiếp tục mua sắm
                    </button>
                </div>

                {cartItems.length === 0 ? (
                    <div className="empty-cart">
                        <p>😢 Giỏ hàng của bạn trống</p>
                        <button
                            onClick={() => navigate('/food')}
                            className="btn btn-primary"
                        >
                            Đi đến danh sách menu
                        </button>
                    </div>
                ) : (
                    <div className="cart-content">
                        <div className="cart-items">
                            <table className="cart-table">
                                <thead>
                                    <tr>
                                        <th>Hình ảnh</th>
                                        <th>Tên món</th>
                                        <th>Giá</th>
                                        <th>Số lượng</th>
                                        <th>Thành tiền</th>
                                        <th>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartItems.map((item) => (
                                        <tr key={item.id} className="cart-item">
                                            <td>
                                                <img
                                                    src={
                                                        item.imageUrl ||
                                                        'https://via.placeholder.com/80'
                                                    }
                                                    alt={item.name}
                                                    className="cart-item-image"
                                                />
                                            </td>
                                            <td>
                                                <span className="item-name">
                                                    {item.name}
                                                </span>
                                                <br />
                                                <span className="item-category">
                                                    {item.category}
                                                </span>
                                            </td>
                                            <td>
                                                {item.price?.toLocaleString(
                                                    'vi-VN',
                                                )}{' '}
                                                VNĐ
                                            </td>
                                            <td>
                                                <div className="quantity-control">
                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.id,
                                                                item.quantity -
                                                                    1,
                                                            )
                                                        }
                                                        className="qty-btn"
                                                    >
                                                        −
                                                    </button>
                                                    <input
                                                        type="number"
                                                        value={item.quantity}
                                                        onChange={(e) =>
                                                            updateQuantity(
                                                                item.id,
                                                                parseInt(
                                                                    e.target
                                                                        .value,
                                                                ) || 1,
                                                            )
                                                        }
                                                        min="1"
                                                        className="qty-input"
                                                    />
                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.id,
                                                                item.quantity +
                                                                    1,
                                                            )
                                                        }
                                                        className="qty-btn"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="item-subtotal">
                                                {(
                                                    item.price * item.quantity
                                                ).toLocaleString('vi-VN')}{' '}
                                                VNĐ
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() =>
                                                        removeItem(item.id)
                                                    }
                                                    className="btn btn-delete"
                                                >
                                                    🗑️
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="cart-summary">
                            <h2>Tóm tắt đơn hàng</h2>
                            <div className="summary-row">
                                <span>Tổng số món:</span>
                                <span>{cartItems.length}</span>
                            </div>
                            <div className="summary-row">
                                <span>Tổng số lượng:</span>
                                <span>
                                    {cartItems.reduce(
                                        (sum, item) => sum + item.quantity,
                                        0,
                                    )}
                                </span>
                            </div>
                            <div className="summary-row">
                                <span>Phí vận chuyển:</span>
                                <span>0 VNĐ</span>
                            </div>
                            <div className="summary-row total">
                                <span>Thành tiền:</span>
                                <span>{total.toLocaleString('vi-VN')} VNĐ</span>
                            </div>
                            <div className="cart-actions">
                                <button
                                    onClick={handleCheckout}
                                    className="btn btn-checkout"
                                >
                                    ✅ Thanh toán
                                </button>
                                <button
                                    onClick={clearCart}
                                    className="btn btn-clear"
                                >
                                    🗑️ Xóa tất cả
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}

export default Cart;
