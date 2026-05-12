import React, { useState } from "react";
import { type Food } from "../services/foodService";
import orderService, { type OrderResponse } from "../services/orderService";
import paymentService from "../services/paymentService";
import authService from "../services/authService";
import "../styles/checkout.css";

interface CheckoutProps {
  items: Food[];
  onSuccess: (order: OrderResponse) => void;
  onCancel: () => void;
}

interface CheckoutFormData {
  deliveryAddress: string;
  phoneNumber: string;
  notes: string;
  paymentMethod: string;
}

export default function Checkout({
  items,
  onSuccess,
  onCancel,
}: CheckoutProps) {
  const [formData, setFormData] = useState<CheckoutFormData>({
    deliveryAddress: "",
    phoneNumber: "",
    notes: "",
    paymentMethod: "COD",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const user = authService.getUser();
  const totalPrice = items.reduce(
    (sum, item) => sum + (item.price || 0) * (item.cartQuantity || 0),
    0
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.deliveryAddress.trim()) {
      setError("Please enter delivery address");
      return;
    }

    if (!formData.phoneNumber.trim()) {
      setError("Please enter phone number");
      return;
    }

    if (items.length === 0) {
      setError("Cart is empty");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create order
      const orderData = {
        userId: user.id,
        items: items.map((item) => ({
          foodId: item.id,
          foodName: item.name,
          quantity: item.cartQuantity || 1,
          price: item.price,
        })),
        deliveryAddress: formData.deliveryAddress,
        phoneNumber: formData.phoneNumber,
        notes: formData.notes,
      };

      const orderResponse = await orderService.createOrder(orderData);
      const order = orderResponse.data?.data || orderResponse.data;

      // Create payment
      const paymentData = {
        orderId: order.id,
        userId: user.id,
        amount: totalPrice,
        paymentMethod: formData.paymentMethod,
        description: `Payment for order #${order.id}`,
      };

      const paymentResponse = await paymentService.createPayment(paymentData);
      const payment = paymentResponse.data?.data || paymentResponse.data;

      // Process payment
      await paymentService.processPayment(payment.id);

      // Success
      onSuccess(order);
    } catch (err: any) {
      console.error("Checkout error:", err);
      setError(err.response?.data?.error || "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-modal">
      <div className="checkout-content">
        <h2>Order Summary & Checkout</h2>

        <div className="checkout-section">
          <h3>Order Items</h3>
          <div className="checkout-items">
            {items.map((item) => (
              <div key={item.id} className="checkout-item">
                <span>{item.name}</span>
                <span>x{item.cartQuantity || 1}</span>
                <span>${((item.price || 0) * (item.cartQuantity || 1)).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="checkout-total">
            <strong>Total: ${totalPrice.toFixed(2)}</strong>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="checkout-section">
            <h3>Delivery Information</h3>

            <div className="form-group">
              <label>Delivery Address *</label>
              <input
                type="text"
                name="deliveryAddress"
                value={formData.deliveryAddress}
                onChange={handleInputChange}
                placeholder="Enter your delivery address"
                required
              />
            </div>

            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div className="form-group">
              <label>Notes (Optional)</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Any special requests?"
                rows={3}
              />
            </div>
          </div>

          <div className="checkout-section">
            <h3>Payment Method</h3>
            <div className="payment-options">
              <label className="radio-label">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={formData.paymentMethod === "COD"}
                  onChange={handleInputChange}
                />
                Cash on Delivery (COD)
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="BANKING"
                  checked={formData.paymentMethod === "BANKING"}
                  onChange={handleInputChange}
                />
                Bank Transfer
              </label>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="checkout-actions">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="cancel-btn"
            >
              Cancel
            </button>
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? "Processing..." : "Place Order & Pay"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
