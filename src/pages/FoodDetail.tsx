import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Food } from '../services/foodService';
import foodService from '../services/foodService';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/food-detail.css';

function FoodDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [food, setFood] = useState<Food | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchFood = async () => {
            try {
                if (id) {
                    const data = await foodService.getFoodById(parseInt(id));
                    setFood(data);
                }
            } catch (err) {
                setError('Không thể tải thông tin món ăn');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchFood();
    }, [id]);

    const handleAddToCart = () => {
        if (food) {
            const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
            const existingItem = cartItems.find(
                (item: Food & { quantity: number }) => item.id === food.id,
            );

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cartItems.push({ ...food, quantity });
            }

            localStorage.setItem('cart', JSON.stringify(cartItems));
            alert(`Đã thêm ${quantity} ${food.name} vào giỏ hàng!`);
            setQuantity(1);
        }
    };

    if (loading) {
        return (
            <>
                <Header />
                <div className="food-detail-container">
                    <p>Đang tải...</p>
                </div>
                <Footer />
            </>
        );
    }

    if (error || !food) {
        return (
            <>
                <Header />
                <div className="food-detail-container">
                    <p className="error">{error || 'Không tìm thấy món ăn'}</p>
                    <button
                        onClick={() => navigate('/food')}
                        className="btn-back"
                    >
                        ← Quay lại danh sách
                    </button>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="food-detail-container">
                <button onClick={() => navigate('/food')} className="btn-back">
                    ← Quay lại danh sách
                </button>

                <div className="food-detail-card">
                    <div className="food-detail-image">
                        <img
                            src={
                                food.imageUrl ||
                                'https://via.placeholder.com/500'
                            }
                            alt={food.name}
                        />
                        {!food.available && (
                            <div className="unavailable-badge">Hết hàng</div>
                        )}
                    </div>

                    <div className="food-detail-info">
                        <div className="food-detail-header">
                            <h1>{food.name}</h1>
                            <div className="food-category">{food.category}</div>
                        </div>

                        <p className="food-description">{food.description}</p>

                        <div className="food-details-grid">
                            <div className="detail-item">
                                <span className="detail-label">Giá:</span>
                                <span className="detail-value price">
                                    {food.price?.toLocaleString('vi-VN')} VNĐ
                                </span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">
                                    Trạng thái:
                                </span>
                                <span className="detail-value">
                                    {food.available
                                        ? '✅ Có sẵn'
                                        : '❌ Hết hàng'}
                                </span>
                            </div>
                        </div>

                        <div className="food-quantity-section">
                            <label htmlFor="quantity">Số lượng:</label>
                            <div className="quantity-control">
                                <button
                                    onClick={() =>
                                        setQuantity(Math.max(1, quantity - 1))
                                    }
                                    className="qty-btn"
                                >
                                    −
                                </button>
                                <input
                                    id="quantity"
                                    type="number"
                                    min="1"
                                    value={quantity}
                                    onChange={(e) =>
                                        setQuantity(
                                            Math.max(
                                                1,
                                                parseInt(e.target.value) || 1,
                                            ),
                                        )
                                    }
                                    className="qty-input"
                                />
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="qty-btn"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <div className="food-actions">
                            <button
                                onClick={handleAddToCart}
                                disabled={!food.available}
                                className="btn btn-primary"
                            >
                                🛒 Đặt món ({quantity})
                            </button>
                            <button
                                onClick={() => navigate('/food')}
                                className="btn btn-secondary"
                            >
                                Tiếp tục mua sắm
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default FoodDetail;
