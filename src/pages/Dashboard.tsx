import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import FoodList from "../components/FoodList";
import Cart from "../components/Cart";
import Checkout from "../components/Checkout";
import Notifications from "../components/Notifications";
import { type Food } from "../services/foodService";
import { type OrderResponse } from "../services/orderService";
import "../styles/dashboard.css";

interface CartItem extends Food {
  cartQuantity: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const user = authService.getUser();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<OrderResponse | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const handleGoToAdmin = () => {
    navigate("/admin/users");
  };

  const handleAddToCart = (food: Food, quantity: number) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === food.id);

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === food.id
            ? { ...item, cartQuantity: item.cartQuantity + quantity }
            : item
        );
      } else {
        return [...prevItems, { ...food, cartQuantity: quantity }];
      }
    });

    // Show brief confirmation
    const message = `${food.name} x${quantity} added to cart`;
    console.log(message);
  };

  const handleUpdateQuantity = (foodId: number, quantity: number) => {
    setCartItems((prevItems) =>
      quantity === 0
        ? prevItems.filter((item) => item.id !== foodId)
        : prevItems.map((item) =>
            item.id === foodId ? { ...item, cartQuantity: quantity } : item
          )
    );
  };

  const handleRemoveItem = (foodId: number) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== foodId)
    );
  };

  const handleCheckoutSuccess = (order: OrderResponse) => {
    setCompletedOrder(order);
    setShowSuccessMessage(true);
    setShowCheckout(false);
    setCartItems([]);

    // Hide success message after 5 seconds
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 5000);
  };

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <h1 className="navbar-title">🍔 Mini Food Ordering</h1>
        <div className="navbar-right">
          <span className="user-name">Welcome, {user.username}!</span>
          {user.role === "ADMIN" && (
            <button onClick={handleGoToAdmin} className="admin-button">
              Admin Panel
            </button>
          )}
          {cartItems.length > 0 && (
            <span className="cart-badge">{cartItems.length}</span>
          )}
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </nav>

      {showSuccessMessage && completedOrder && (
        <div className="success-message">
          ✓ Order #{completedOrder.id} placed successfully! Payment processed. Check your notifications for updates.
        </div>
      )}

      <div className="dashboard-content">
        <div className="dashboard-layout">
          <div className="main-section">
            <FoodList onAddToCart={handleAddToCart} />
          </div>

          <div className="sidebar-section">
            <Cart
              items={cartItems}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onCheckout={() => setShowCheckout(true)}
            />

            <div className="notifications-section">
              <Notifications userId={user.id} autoRefresh={true} />
            </div>
          </div>
        </div>
      </div>

      {showCheckout && (
        <Checkout
          items={cartItems}
          onSuccess={handleCheckoutSuccess}
          onCancel={() => setShowCheckout(false)}
        />
      )}
    </div>
  );
}
