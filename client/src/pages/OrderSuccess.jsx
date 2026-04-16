import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { formatPrice } from '../utils/formatPrice';
import { getOrderById } from '../services/orderService';
import './OrderSuccess.css';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const data = await getOrderById(orderId);
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fk-os-loading">
        <div className="fk-os-spinner"></div>
        <p>Loading your order...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="fk-os-error-page">
        <img
          src="https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90"
          alt="Order Not Found"
        />
        <h2>Order Not Found</h2>
        <p>We couldn't find this order. It may have been moved or deleted.</p>
        <Link to="/" className="fk-os-shop-btn">Continue Shopping</Link>
      </div>
    );
  }

  const addr = order.shipping_address || {};
  const totalItems = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  // Estimate delivery date (5 days from order creation)
  const orderDate = new Date(order.created_at);
  const deliveryDate = new Date(orderDate);
  deliveryDate.setDate(deliveryDate.getDate() + 5);
  const formattedDelivery = deliveryDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
  const formattedOrderDate = orderDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="fk-os-page">
      {/* TOP GREEN SUCCESS BANNER */}
      <div className="fk-os-top-banner">
        <div className="fk-os-banner-inner">
          <div className="fk-os-check-wrap">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="14" fill="white" fillOpacity="0.2"/>
              <path d="M8 14.5L12.5 19L20 11" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="fk-os-banner-text">
            <h2>Order Placed Successfully!</h2>
            <p>Your order has been placed and will be delivered by <strong>{formattedDelivery}</strong></p>
          </div>
        </div>
      </div>

      <div className="fk-os-container">
        <div className="fk-os-main">

          {/* ORDER META */}
          <div className="fk-os-card fk-os-meta-card">
            <div className="fk-os-meta-row">
              <div className="fk-os-meta-item">
                <span className="fk-os-meta-label">Order ID</span>
                <span className="fk-os-meta-value order-id-mono">{order.id}</span>
              </div>
              <div className="fk-os-meta-item">
                <span className="fk-os-meta-label">Order Date</span>
                <span className="fk-os-meta-value">{formattedOrderDate}</span>
              </div>
              <div className="fk-os-meta-item">
                <span className="fk-os-meta-label">Payment</span>
                <span className="fk-os-meta-value">{order.payment_method || 'Credit Card'}</span>
              </div>
              <div className="fk-os-meta-item">
                <span className="fk-os-meta-label">Status</span>
                <span className={`fk-os-status-badge status-${order.status}`}>{order.status?.toUpperCase()}</span>
              </div>
            </div>
          </div>

          {/* DELIVERY TIMELINE */}
          <div className="fk-os-card">
            <h3 className="fk-os-section-title">Delivery Timeline</h3>
            <div className="fk-os-timeline">
              <div className="fk-os-timeline-step active">
                <div className="fk-os-step-dot active"></div>
                <div className="fk-os-step-info">
                  <span className="step-label">Order Placed</span>
                  <span className="step-date">{formattedOrderDate}</span>
                </div>
              </div>
              <div className="fk-os-timeline-line"></div>
              <div className="fk-os-timeline-step">
                <div className="fk-os-step-dot"></div>
                <div className="fk-os-step-info">
                  <span className="step-label">Processing</span>
                  <span className="step-date">Within 24 hours</span>
                </div>
              </div>
              <div className="fk-os-timeline-line"></div>
              <div className="fk-os-timeline-step">
                <div className="fk-os-step-dot"></div>
                <div className="fk-os-step-info">
                  <span className="step-label">Shipping</span>
                  <span className="step-date">2-3 Days</span>
                </div>
              </div>
              <div className="fk-os-timeline-line"></div>
              <div className="fk-os-timeline-step">
                <div className="fk-os-step-dot target"></div>
                <div className="fk-os-step-info">
                  <span className="step-label">Delivery</span>
                  <span className="step-date">{formattedDelivery}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ORDER ITEMS */}
          <div className="fk-os-card">
            <h3 className="fk-os-section-title">
              Order Items
              <span className="fk-os-items-count">({totalItems} item{totalItems !== 1 ? 's' : ''})</span>
            </h3>
            <div className="fk-os-items-list">
              {order.items?.map((item, i) => (
                <div key={i} className="fk-os-item-row">
                  <div className="fk-os-item-info">
                    <span className="fk-os-item-qty-badge">x{item.quantity}</span>
                    <span className="fk-os-item-name">{item.name}</span>
                  </div>
                  <div className="fk-os-item-price-col">
                    <span className="fk-os-item-unit">@ {formatPrice(item.price)}</span>
                    <span className="fk-os-item-total">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="fk-os-total-row">
              <span>Total Amount</span>
              <span className="fk-os-total-amount">{formatPrice(order.total_amount)}</span>
            </div>
          </div>

          {/* SHIPPING ADDRESS */}
          <div className="fk-os-card">
            <h3 className="fk-os-section-title">Delivering To</h3>
            <div className="fk-os-address-box">
              <div className="fk-os-addr-name">
                {addr.firstName} {addr.lastName}
                {addr.phone && <span className="fk-os-addr-phone">{addr.phone}</span>}
              </div>
              <p className="fk-os-addr-text">
                {addr.address && <>{addr.address},<br /></>}
                {addr.city}{addr.state ? `, ${addr.state}` : ''} - {addr.zipCode}
              </p>
              {addr.email && <p className="fk-os-addr-email">✉ {addr.email}</p>}
            </div>
          </div>

          {/* BOTTOM INFO */}
          <div className="fk-os-info-banner">
            <div className="fk-os-info-icon">📦</div>
            <p>Your order is confirmed. You'll receive an SMS & email with tracking details once it ships.</p>
          </div>

          {/* ACTIONS */}
          <div className="fk-os-actions">
            <Link to="/" className="fk-os-continue-btn">Continue Shopping</Link>
            <button onClick={() => navigate('/dashboard')} className="fk-os-orders-btn">View My Orders</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
