import React, { useState, useEffect } from "react";
import foodService, { type Food } from "../services/foodService";
import "../styles/foods.css";

interface FoodListProps {
  onAddToCart: (food: Food, quantity: number) => void;
}

export default function FoodList({ onAddToCart }: FoodListProps) {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const data = await foodService.getAllFoods();
      setFoods(data.data || data);
      setError(null);
    } catch (err) {
      console.error("Error fetching foods:", err);
      setError("Failed to load foods. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);

    if (keyword.trim()) {
      try {
        const data = await foodService.searchFoods(keyword);
        setFoods(data.data || data);
      } catch (err) {
        console.error("Error searching foods:", err);
      }
    } else {
      fetchFoods();
    }
  };

  const handleQuantityChange = (foodId: number, quantity: number) => {
    setQuantities((prev) => ({
      ...prev,
      [foodId]: Math.max(0, quantity),
    }));
  };

  const handleAddToCart = (food: Food) => {
    const quantity = quantities[food.id] || 1;
    if (quantity > 0) {
      onAddToCart(food, quantity);
      setQuantities((prev) => ({ ...prev, [food.id]: 0 }));
    }
  };

  if (loading) {
    return <div className="loading-container">Loading foods...</div>;
  }

  return (
    <div className="food-list-container">
      <div className="food-list-header">
        <h2>Our Foods</h2>
        <input
          type="text"
          placeholder="Search foods..."
          value={searchKeyword}
          onChange={handleSearch}
          className="search-input"
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      {foods.length === 0 ? (
        <div className="no-foods">No foods found</div>
      ) : (
        <div className="food-grid">
          {foods.map((food) => (
            <div key={food.id} className="food-card">
              {food.imageUrl && (
                <img
                  src={food.imageUrl}
                  alt={food.name}
                  className="food-image"
                />
              )}
              <div className="food-info">
                <h3>{food.name}</h3>
                {food.category && <p className="category">({food.category})</p>}
                {food.description && (
                  <p className="description">{food.description}</p>
                )}
                <div className="food-footer">
                  <span className="price">${food.price.toFixed(2)}</span>
                  <span
                    className={`status ${food.available ? "available" : "unavailable"}`}
                  >
                    {food.available ? "Available" : "Unavailable"}
                  </span>
                </div>
              </div>
              {food.available && (
                <div className="add-to-cart-section">
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={quantities[food.id] || 0}
                    onChange={(e) =>
                      handleQuantityChange(food.id, parseInt(e.target.value))
                    }
                    placeholder="Qty"
                    className="quantity-input"
                  />
                  <button
                    onClick={() => handleAddToCart(food)}
                    disabled={(quantities[food.id] || 0) === 0}
                    className="add-btn"
                  >
                    Add to Cart
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
