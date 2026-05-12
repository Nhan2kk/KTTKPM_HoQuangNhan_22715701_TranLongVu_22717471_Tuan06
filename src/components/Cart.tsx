import React from "react";
import { type Food } from "../services/foodService";
import "../styles/cart.css";

interface CartItem extends Food {
  cartQuantity: number;
}

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (foodId: number, quantity: number) => void;
  onRemoveItem: (foodId: number) => void;
  onCheckout: () => void;
}

export default function Cart({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartProps) {
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.cartQuantity,
    0
  );
  const totalItems = items.reduce((sum, item) => sum + item.cartQuantity, 0);

  if (items.length === 0) {
    return (
      <div className="cart-container">
        <h2>Shopping Cart</h2>
        <div className="empty-cart">
          <p>Your cart is empty</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Shopping Cart ({totalItems} items)</h2>

      <div className="cart-items">
        {items.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="item-info">
              <h4>{item.name}</h4>
              <p className="item-price">${item.price.toFixed(2)} each</p>
            </div>

            <div className="item-quantity">
              <button
                onClick={() =>
                  onUpdateQuantity(item.id, item.cartQuantity - 1)
                }
                className="qty-btn"
              >
                -
              </button>
              <input
                type="number"
                value={item.cartQuantity}
                onChange={(e) =>
                  onUpdateQuantity(item.id, parseInt(e.target.value) || 0)
                }
                className="qty-input"
                min="0"
              />
              <button
                onClick={() =>
                  onUpdateQuantity(item.id, item.cartQuantity + 1)
                }
                className="qty-btn"
              >
                +
              </button>
            </div>

            <div className="item-total">
              ${(item.price * item.cartQuantity).toFixed(2)}
            </div>

            <button
              onClick={() => onRemoveItem(item.id)}
              className="remove-btn"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="summary-row">
          <span>Subtotal:</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Shipping:</span>
          <span>Free</span>
        </div>
        <div className="summary-row total">
          <span>Total:</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
      </div>

      <button onClick={onCheckout} className="checkout-btn">
        Proceed to Checkout
      </button>
    </div>
  );
}
