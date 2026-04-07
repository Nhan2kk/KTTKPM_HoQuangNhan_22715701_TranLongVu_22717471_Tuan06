import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import foodService, { type Food } from '../services/foodService';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/food.css';

function FoodManagement() {
    const navigate = useNavigate();
    const [foods, setFoods] = useState<Food[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [categories, setCategories] = useState<string[]>([]);

    const [formData, setFormData] = useState<Food>({
        name: '',
        description: '',
        price: 0,
        imageUrl: '',
        category: '',
        available: true,
    });

    // Tải danh sách món ăn
    useEffect(() => {
        fetchFoods();
    }, []);

    // Lấy danh sách danh mục từ dữ liệu
    useEffect(() => {
        const uniqueCategories = [
            ...new Set(foods.map((f) => f.category).filter(Boolean)),
        ];
        setCategories(uniqueCategories as string[]);
    }, [foods]);

    const fetchFoods = async () => {
        try {
            setLoading(true);
            const data = await foodService.getAllFoods();
            setFoods(data);
            setError('');
        } catch (err) {
            setError('Không thể tải danh sách món ăn');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Tìm kiếm
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchKeyword.trim()) {
            fetchFoods();
            return;
        }

        try {
            setLoading(true);
            const data = await foodService.searchFoods(searchKeyword);
            setFoods(data);
        } catch (err) {
            setError('Tìm kiếm thất bại');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Lọc theo danh mục
    const handleCategoryFilter = (category: string) => {
        setSelectedCategory(category);
        if (category === 'all') {
            fetchFoods();
        } else {
            filterByCategory(category);
        }
    };

    const filterByCategory = async (category: string) => {
        try {
            setLoading(true);
            const data = await foodService.getFoodsByCategory(category);
            setFoods(data);
        } catch (err) {
            setError('Lọc theo danh mục thất bại');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Xử lý thay đổi form
    const handleFormChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]:
                type === 'checkbox'
                    ? (e.target as HTMLInputElement).checked
                    : value,
        }));
    };

    // Thêm/Cập nhật món ăn
    const handleSubmitForm = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.price || !formData.category) {
            alert('Vui lòng điền đủ thông tin bắt buộc');
            return;
        }

        try {
            if (editingId) {
                await foodService.updateFood(editingId, formData);
                alert('Cập nhật món ăn thành công!');
                setEditingId(null);
            } else {
                await foodService.createFood(formData);
                alert('Thêm món ăn mới thành công!');
            }

            resetForm();
            fetchFoods();
        } catch (err) {
            alert(
                'Lưu thất bại: ' +
                    (err instanceof Error ? err.message : 'Lỗi không xác định'),
            );
            console.error(err);
        }
    };

    // Xóa món ăn
    const handleDelete = async (id: number) => {
        if (confirm('Bạn có chắc chắn muốn xóa món ăn này?')) {
            try {
                await foodService.deleteFood(id);
                alert('Xóa thành công!');
                fetchFoods();
            } catch (err) {
                alert('Xóa thất bại');
                console.error(err);
            }
        }
    };

    // Chỉnh sửa món ăn
    const handleEdit = (food: Food) => {
        setFormData(food);
        setEditingId(food.id || null);
        setShowForm(true);
        window.scrollTo(0, 0);
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            price: 0,
            imageUrl: '',
            category: '',
            available: true,
        });
        setEditingId(null);
        setShowForm(false);
    };

    // Xử lý đặt món từ danh sách
    const handleOrderFromList = (food: Food) => {
        navigate(`/food/${food.id}`);
    };

    // Lọc danh sách dựa trên tìm kiếm
    let filteredFoods = foods;
    if (searchKeyword) {
        filteredFoods = foods.filter((f) =>
            f.name.toLowerCase().includes(searchKeyword.toLowerCase()),
        );
    }

    return (
        <>
            <Header />
            <div className="food-management-container">
                {/* Search and Filter Section */}
                <div className="food-controls">
                    <form onSubmit={handleSearch} className="search-form">
                        <input
                            type="text"
                            placeholder="🔍 Tìm kiếm món ăn..."
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            className="search-input"
                        />
                        <button type="submit" className="btn btn-search">
                            Tìm kiếm
                        </button>
                    </form>

                    <div className="category-filters">
                        <button
                            className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                            onClick={() => handleCategoryFilter('all')}
                        >
                            Tất cả
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                                onClick={() => handleCategoryFilter(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="btn btn-add"
                    >
                        {showForm ? '✕ Đóng' : '➕ Thêm món ăn mới'}
                    </button>
                </div>

                {/* Form Section */}
                {showForm && (
                    <div className="food-form-container">
                        <h2>
                            {editingId ? 'Chỉnh sửa món ăn' : 'Thêm món ăn mới'}
                        </h2>
                        <form onSubmit={handleSubmitForm} className="food-form">
                            <div className="form-group">
                                <label htmlFor="name">Tên món ăn *</label>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleFormChange}
                                    placeholder="Nhập tên món ăn"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="description">Mô tả</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleFormChange}
                                    placeholder="Nhập mô tả món ăn"
                                    rows={3}
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="price">Giá (VNĐ) *</label>
                                    <input
                                        id="price"
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleFormChange}
                                        placeholder="0"
                                        min="0"
                                        step="1000"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="category">Danh mục *</label>
                                    <input
                                        id="category"
                                        type="text"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleFormChange}
                                        placeholder="VD: Cơm, Bún, Phở..."
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="imageUrl">URL hình ảnh</label>
                                <input
                                    id="imageUrl"
                                    type="url"
                                    name="imageUrl"
                                    value={formData.imageUrl}
                                    onChange={handleFormChange}
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>

                            <div className="form-group checkbox">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="available"
                                        checked={formData.available}
                                        onChange={handleFormChange}
                                    />
                                    Có sẵn
                                </label>
                            </div>

                            <div className="form-actions">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >
                                    {editingId ? '💾 Cập nhật' : '➕ Thêm mới'}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="btn btn-secondary"
                                >
                                    Hủy
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Error Message */}
                {error && <div className="error-message">{error}</div>}

                {/* Loading State */}
                {loading && <div className="loading">Đang tải...</div>}

                {/* Foods List */}
                {!loading && filteredFoods.length > 0 ? (
                    <div className="foods-grid">
                        {filteredFoods.map((food) => (
                            <div key={food.id} className="food-card">
                                <div className="food-card-image">
                                    <img
                                        src={
                                            food.imageUrl ||
                                            'https://via.placeholder.com/250'
                                        }
                                        alt={food.name}
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src =
                                                'https://via.placeholder.com/250';
                                        }}
                                    />
                                    {!food.available && (
                                        <div className="unavailable-badge">
                                            Hết hàng
                                        </div>
                                    )}
                                </div>
                                <div className="food-card-content">
                                    <div className="food-card-header">
                                        <h3>{food.name}</h3>
                                        <span className="food-category-tag">
                                            {food.category}
                                        </span>
                                    </div>
                                    <p className="food-description">
                                        {food.description || 'Không có mô tả'}
                                    </p>
                                    <div className="food-price">
                                        {food.price?.toLocaleString('vi-VN')}{' '}
                                        VNĐ
                                    </div>
                                </div>
                                <div className="food-card-actions">
                                    <button
                                        onClick={() =>
                                            handleOrderFromList(food)
                                        }
                                        disabled={!food.available}
                                        className="btn btn-order"
                                        title="Xem chi tiết và đặt món"
                                    >
                                        🛒 Đặt món
                                    </button>
                                    <button
                                        onClick={() => handleEdit(food)}
                                        className="btn btn-edit"
                                        title="Chỉnh sửa"
                                    >
                                        ✏️ Sửa
                                    </button>
                                    <button
                                        onClick={() =>
                                            food.id && handleDelete(food.id)
                                        }
                                        className="btn btn-delete"
                                        title="Xóa"
                                    >
                                        🗑️ Xóa
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    !loading && (
                        <div className="no-results">
                            <p>😕 Không tìm thấy món ăn nào</p>
                            <button
                                onClick={() => {
                                    setSearchKeyword('');
                                    setSelectedCategory('all');
                                    fetchFoods();
                                }}
                                className="btn btn-secondary"
                            >
                                Xem tất cả
                            </button>
                        </div>
                    )
                )}
            </div>
            <Footer />
        </>
    );
}

export default FoodManagement;
