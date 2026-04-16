import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../utils/formatPrice';
import { createOrder } from '../services/orderService';
import { clearCart, setCartId } from '../redux/cartSlice';
import addressService from '../services/addressService';
import { useToast } from '../components/Toast';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart);
  const { isAuthenticated, user } = useSelector(state => state.auth);
  
  // Steps: 1: Address, 2: Order Summary, 3: Payment
  const [activeStep, setActiveStep] = useState(1);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Credit Card'); // New state for payment method
  const toast = useToast();
  
  // Form for new address
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [formData, setFormData] = useState({
    name: user ? user.name : '',
    phone: '',
    pincode: '',
    address: '',
    city: '',
    state: '',
    type: 'Home'
  });

  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=checkout');
    } else {
      fetchAddresses();
    }
  }, [isAuthenticated, navigate]);

  const fetchAddresses = async () => {
    try {
      const res = await addressService.getMyAddresses();
      if (res.success && res.data.length > 0) {
        setAddresses(res.data);
        setSelectedAddress(res.data[0]);
      } else {
        setShowNewAddressForm(true);
      }
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
    }
  };

  if (cart.items.length === 0 && !loading) {
    return (
      <div className="fk-checkout-empty">
        <img src="https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90" alt="Empty Cart" />
        <h2>Your cart is empty!</h2>
        <p>Add items to it now.</p>
        <button onClick={() => navigate('/')}>Shop now</button>
      </div>
    );
  }

  // --- Address Logic ---
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.pincode || !formData.address || !formData.city) {
      toast.error('Please fill all required fields.');
      return;
    }
    
    try {
      const newAddress = await addressService.addAddress(formData);
      setAddresses([newAddress.data, ...addresses]);
      setSelectedAddress(newAddress.data);
      setShowNewAddressForm(false);
      setActiveStep(2);
      toast.success('Address saved successfully!');
    } catch (error) {
      console.error('Failed to save address', error);
      toast.error('Failed to save address. Please try again.');
    }
  };

  const deliverHere = () => {
    if (selectedAddress) {
      setActiveStep(2);
    }
  };

  // --- Payment Logic ---
  const handleCardChange = (e) => {
    const { name, value } = e.target;
    if (name === 'cardNumber') {
      const val = value.replace(/\D/g, '').substring(0, 16);
      setCardData(prev => ({ ...prev, [name]: val }));
      return;
    }
    if (name === 'cvv') {
      const val = value.replace(/\D/g, '').substring(0, 3);
      setCardData(prev => ({ ...prev, [name]: val }));
      return;
    }
    setCardData(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    
    // Only validate card details if Credit Card is selected
    if (paymentMethod === 'Credit Card') {
      if (cardData.cardNumber.length < 16 || cardData.cvv.length < 3 || !cardData.expiryDate) {
        toast.error('Please fill out card details correctly.');
        return;
      }
    }

    try {
      setLoading(true);
      setPaymentProcessing(true);
      
      // Artificial delay to simulate processing
      await new Promise(resolve => setTimeout(resolve, paymentMethod === 'Credit Card' ? 2000 : 800));

      const nameParts = (user?.name || selectedAddress?.name || 'Guest User').split(' ');
      const firstName = nameParts[0] || 'User';
      const lastName = nameParts.slice(1).join(' ') || 'Name';

      const orderBody = {
        firstName,
        lastName,
        address: selectedAddress.address,
        city: selectedAddress.city,
        state: 'N/A',
        zipCode: selectedAddress.pincode
      };

      const paymentStatus = paymentMethod === 'Cash on Delivery' ? 'pending' : 'paid';

      const order = await createOrder(
        cart.cartId,
        orderBody,
        user.email,
        selectedAddress.phone,
        paymentMethod,
        paymentStatus
      );

      dispatch(clearCart());
      navigate(`/order-success/${order.orderId}`);
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Payment failed. Please check your details and try again.');
    } finally {
      setLoading(false);
      setPaymentProcessing(false);
    }
  };

  const totalAmount = cart.totalPrice;
  const deliveryCharge = totalAmount > 500 ? 0 : 40;
  const mprTotal = totalAmount + (totalAmount * 0.47); // Mock huge MRP discount
  const discountTotal = mprTotal - totalAmount;
  const finalAmount = totalAmount + deliveryCharge;

  const getFirstImage = (imagesStr) => {
    if (!imagesStr) return 'https://placehold.co/200x200?text=No+Image';
    try {
      if (typeof imagesStr === 'string' && imagesStr.startsWith('[')) {
        return JSON.parse(imagesStr)[0];
      }
      if (typeof imagesStr === 'string' && imagesStr.startsWith('http')) {
        return imagesStr;
      }
      if (Array.isArray(imagesStr)) {
        return imagesStr[0];
      }
    } catch (e) {
      console.error('Image parse error:', e);
    }
    return 'https://placehold.co/200x200?text=No+Image';
  };

  return (
    <div className="fk-checkout-page">
      {paymentProcessing && (
        <div className="fk-payment-overlay">
          <div className="fk-payment-modal">
            <div className="fk-spinner"></div>
            <h3>Processing Payment...</h3>
            <p>Please do not refresh the page or click back.</p>
          </div>
        </div>
      )}

      {/* Top Progress Bar */}
      <div className="fk-checkout-header-wrapper">
         <div className="fk-checkout-progress">
            <div className={`fk-progress-step ${activeStep >= 1 ? 'completed' : ''}`}>
               <div className="fk-p-circle">{activeStep > 1 ? '✓' : '1'}</div>
               <span className="fk-p-label">Address</span>
            </div>
            <div className={`fk-progress-line ${activeStep >= 2 ? 'active' : ''}`}></div>
            
            <div className={`fk-progress-step ${activeStep === 2 ? 'active' : activeStep > 2 ? 'completed' : ''}`}>
               <div className="fk-p-circle">{activeStep > 2 ? '✓' : '2'}</div>
               <span className="fk-p-label">Order Summary</span>
            </div>
            <div className={`fk-progress-line ${activeStep === 3 ? 'active' : ''}`}></div>
            
            <div className={`fk-progress-step ${activeStep === 3 ? 'active' : ''}`}>
               <div className="fk-p-circle">3</div>
               <span className="fk-p-label">Payment</span>
            </div>
         </div>
      </div>

      <div className="fk-checkout-container">
        
        {/* LEFT COLUMN */}
        <div className="fk-checkout-left">
          
          {/* STEP 1: LOGIN (Always summarized since user is logged in) */}
          <div className="fk-step-card summary">
            <div className="fk-step-header summary-header">
              <span className="fk-step-badge">1</span>
              <div className="fk-step-title">
                LOGIN <span className="check">✓</span>
                <span className="fk-summary-value">{user?.name} &nbsp; +91{user?.phone || '9876543210'}</span>
              </div>
              <button className="fk-change-btn">Change</button>
            </div>
          </div>

          {/* STEP 2: DELIVERY ADDRESS */}
          <div className={`fk-step-card ${activeStep === 1 ? 'active' : 'summary'}`}>
            <div className={`fk-step-header ${activeStep === 1 ? 'active-header' : 'summary-header'}`}>
              <span className="fk-step-badge">2</span>
              <div className="fk-step-title">
                DELIVERY ADDRESS {activeStep > 1 && <span className="check">✓</span>}
                {activeStep > 1 && selectedAddress && (
                  <span className="fk-summary-value">
                     {selectedAddress.name} {selectedAddress.address}, {selectedAddress.city} - {selectedAddress.pincode}
                  </span>
                )}
              </div>
              {activeStep > 1 && (
                <button className="fk-change-btn" onClick={() => setActiveStep(1)}>Change</button>
              )}
            </div>

            {activeStep === 1 && (
              <div className="fk-step-body">
                {addresses.length > 0 && !showNewAddressForm ? (
                   <div className="fk-address-list">
                      {addresses.map(addr => (
                         <div key={addr.id} className={`fk-address-item ${selectedAddress?.id === addr.id ? 'selected' : ''}`}>
                            <div className="fk-address-radio">
                               <input 
                                 type="radio" 
                                 name="address" 
                                 checked={selectedAddress?.id === addr.id}
                                 onChange={() => setSelectedAddress(addr)}
                               />
                            </div>
                            <div className="fk-address-details">
                               <div className="name-type">
                                  <span className="name">{addr.name}</span>
                                  <span className="type">{addr.type}</span>
                                  <span className="phone">{addr.phone}</span>
                               </div>
                               <div className="full-address">
                                  {addr.address}, {addr.city} - <span className="bold">{addr.pincode}</span>
                               </div>
                               {selectedAddress?.id === addr.id && (
                                  <button className="fk-deliver-here-btn" onClick={deliverHere}>
                                     DELIVER HERE
                                  </button>
                               )}
                            </div>
                         </div>
                      ))}
                      <div className="fk-add-new-address" onClick={() => setShowNewAddressForm(true)}>
                         <span>+</span> Add a new address
                      </div>
                   </div>
                ) : (
                  <form className="fk-address-form" onSubmit={handleSaveAddress}>
                    <div className="fk-form-row">
                      <div className="fk-input-group">
                        <input type="text" name="name" value={formData.name} onChange={handleAddressChange} required placeholder="Name" />
                      </div>
                      <div className="fk-input-group">
                        <input type="tel" name="phone" value={formData.phone} onChange={handleAddressChange} required placeholder="10-digit mobile number" />
                      </div>
                    </div>
                    <div className="fk-form-row">
                      <div className="fk-input-group">
                        <input type="text" name="pincode" value={formData.pincode} onChange={handleAddressChange} required placeholder="Pincode" />
                      </div>
                      <div className="fk-input-group">
                        <input type="text" name="city" value={formData.city} onChange={handleAddressChange} required placeholder="City/District/Town" />
                      </div>
                    </div>
                    <div className="fk-input-group full">
                      <textarea name="address" value={formData.address} onChange={handleAddressChange} required rows="3" placeholder="Address (Area and Street)"></textarea>
                    </div>
                    <div className="fk-address-type">
                      <p>Address Type</p>
                      <label><input type="radio" name="type" value="Home" checked={formData.type === 'Home'} onChange={handleAddressChange}/> Home (All day delivery)</label>
                      <label><input type="radio" name="type" value="Work" checked={formData.type === 'Work'} onChange={handleAddressChange}/> Work (Delivery between 10 AM - 5 PM)</label>
                    </div>
                    <div className="fk-form-actions">
                      <button type="submit" className="fk-btn-save">SAVE AND DELIVER HERE</button>
                      {addresses.length > 0 && (
                        <button type="button" className="fk-btn-cancel" onClick={() => setShowNewAddressForm(false)}>CANCEL</button>
                      )}
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* STEP 3: ORDER SUMMARY */}
          <div className={`fk-step-card ${activeStep === 2 ? 'active' : 'summary'}`}>
            <div className={`fk-step-header ${activeStep === 2 ? 'active-header' : 'summary-header'}`}>
              <span className="fk-step-badge">3</span>
              <div className="fk-step-title">
                ORDER SUMMARY {activeStep > 2 && <span className="check">✓</span>}
                {activeStep > 2 && <span className="fk-summary-value">{cart.items.length} Item{cart.items.length > 1 ? 's' : ''}</span>}
              </div>
              {activeStep > 2 && (
                <button className="fk-change-btn" onClick={() => setActiveStep(2)}>Change</button>
              )}
            </div>

            {activeStep === 2 && (
              <div className="fk-step-body no-pad">
                <div className="fk-deliver-to-banner">
                  <span className="label">Deliver to:</span>
                  <span className="name">{selectedAddress?.name}</span>
                  <span className="type">{selectedAddress?.type}</span>
                  <button className="change-btn" onClick={() => setActiveStep(1)}>Change</button>
                  <p className="address-text">
                    {selectedAddress?.address}, {selectedAddress?.city} - {selectedAddress?.pincode}
                  </p>
                  <p className="phone-text">{selectedAddress?.phone}</p>
                </div>

                {cart.items.map(item => (
                  <div key={item.product_id} className="fk-summary-item">
                    <div className="item-image-box">
                      <img src={getFirstImage(item.images)} alt={item.name} />
                      <div className="qty-control">
                        <span className="qty-label">Qty:</span>
                        <select value={item.quantity} disabled>
                          <option>{item.quantity}</option>
                        </select>
                      </div>
                    </div>
                    <div className="item-details-box">
                      <div className="item-title">{item.name}</div>
                      {item.size && <div className="item-size">Size: {item.size}</div>}
                      
                      <div className="item-rating-row">
                         <span className="rating-badge">4.0 ★</span>
                         <span className="review-count">(215)</span>
                         <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" className="assured-icon" alt="Assured" />
                      </div>

                      <div className="item-price-row">
                        <span className="discount-arrow">⬇ 47%</span>
                        <span className="strike-mrp">{formatPrice(mprTotal / cart.items.length)}</span>
                        <span className="final-price">{formatPrice(item.price)}</span>
                      </div>
                      
                      <div className="delivery-info">
                        Delivery by Tomorrow, Sun | <span className={deliveryCharge === 0 ? "free" : ""}>{deliveryCharge === 0 ? 'Free' : `₹${deliveryCharge}`}</span>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="fk-email-info">
                   <span className="email-icon">✉</span> Email ID required for delivery
                   <button className="add-email-btn">Add Email</button>
                </div>

                <div className="fk-open-box">
                   <div className="open-box-title">
                      <img src="https://rukminim2.flixcart.com/www/100/100/promos/12/03/2021/bfab753a-c5ad-46eb-8e9a-7c98f04746f3.png?q=90" alt="Box" />
                      Rest assured with Open Box Delivery
                   </div>
                   <p>Delivery agent will open the package so you can check for correct product, damage or missing items.</p>
                </div>

                <div className="fk-summary-footer">
                  <div className="summary-total-left">
                     <span className="strike">{formatPrice(mprTotal)}</span>
                     <span className="final">{formatPrice(finalAmount)}</span>
                     <span className="view-details">View price details</span>
                  </div>
                  <button className="fk-continue-btn" onClick={() => setActiveStep(3)}>CONTINUE</button>
                </div>
              </div>
            )}
          </div>

          {/* STEP 4: PAYMENT OPTIONS */}
          <div className={`fk-step-card ${activeStep === 3 ? 'active' : 'inactive'}`}>
            <div className={`fk-step-header ${activeStep === 3 ? 'active-header' : 'inactive-header'}`}>
              <span className="fk-step-badge">4</span>
              <div className="fk-step-title">PAYMENT OPTIONS</div>
            </div>

            {activeStep === 3 && (
              <div className="fk-step-body no-pad-top">
                <div className="fk-payment-options-list">
                  
                  {/* Credit Card Option */}
                  <div className={`fk-pay-option ${paymentMethod === 'Credit Card' ? 'selected' : ''}`} onClick={() => setPaymentMethod('Credit Card')}>
                     <div className="pay-option-header">
                        <input type="radio" checked={paymentMethod === 'Credit Card'} onChange={() => setPaymentMethod('Credit Card')}/>
                        <span className="pay-label">Credit / Debit / ATM Card</span>
                     </div>
                     {paymentMethod === 'Credit Card' && (
                       <div className="pay-option-body" onClick={e => e.stopPropagation()}>
                          <form onSubmit={handlePaymentSubmit}>
                            <div className="fk-card-input-wrapper">
                               <input 
                                 type="text" 
                                 name="cardNumber"
                                 value={cardData.cardNumber}
                                 onChange={handleCardChange}
                                 placeholder="Enter card number" 
                                 maxLength="16"
                                 required={paymentMethod === 'Credit Card'}
                              />
                              <div className="card-icons">
                                <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/payment/visa.png" alt="Visa" />
                                <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/payment/mastercard.png" alt="Mastercard" />
                              </div>
                            </div>
                            
                            <div className="fk-card-h-row">
                               <input 
                                 type="text" 
                                 name="expiryDate"
                                 value={cardData.expiryDate}
                                 onChange={handleCardChange}
                                 className="small-input"
                                 placeholder="Valid thru (MM/YY)" 
                                 maxLength="5"
                                 required={paymentMethod === 'Credit Card'}
                               />
                               <input 
                                 type="password"
                                 name="cvv"
                                 value={cardData.cvv}
                                 onChange={handleCardChange} 
                                 className="small-input"
                                 placeholder="CVV" 
                                 maxLength="3"
                                 required={paymentMethod === 'Credit Card'}
                               />
                            </div>
                            <button type="submit" className="fk-pay-btn" disabled={loading}>
                              PAY {formatPrice(finalAmount)}
                            </button>
                          </form>
                       </div>
                     )}
                  </div>

                  {/* UPI Option */}
                  <div className="fk-pay-option disabled">
                     <div className="pay-option-header">
                        <input type="radio" disabled/>
                        <span className="pay-label">UPI (Currently Unavailable)</span>
                     </div>
                  </div>
                  
                  {/* COD Option */}
                  <div className={`fk-pay-option ${paymentMethod === 'Cash on Delivery' ? 'selected' : ''}`} onClick={() => setPaymentMethod('Cash on Delivery')}>
                     <div className="pay-option-header">
                        <input type="radio" checked={paymentMethod === 'Cash on Delivery'} onChange={() => setPaymentMethod('Cash on Delivery')} />
                        <span className="pay-label">Cash on Delivery</span>
                     </div>
                     {paymentMethod === 'Cash on Delivery' && (
                       <div className="pay-option-body" onClick={e => e.stopPropagation()}>
                         <form onSubmit={handlePaymentSubmit}>
                           <p style={{marginBottom: '1rem', color: '#878787', fontSize: '14px'}}>
                             Pay conveniently at your doorstep. We accept CASH, UPI, and Card.
                           </p>
                           <button type="submit" className="fk-pay-btn" disabled={loading}>
                             CONFIRM ORDER
                           </button>
                         </form>
                       </div>
                     )}
                  </div>
                  
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: PRICE DETAILS */}
        <div className="fk-checkout-right">
          <div className="fk-price-details-card">
            <div className="price-details-header">PRICE DETAILS</div>
            <div className="price-details-body">
               <div className="p-row">
                 <span>Price ({cart.items.length} item{cart.items.length > 1 ? 's' : ''})</span>
                 <span>{formatPrice(mprTotal)}</span>
               </div>
               <div className="p-row">
                 <span>Discount</span>
                 <span className="green">- {formatPrice(discountTotal)}</span>
               </div>
               <div className="p-row">
                 <span>Delivery Charges</span>
                 <span className={deliveryCharge === 0 ? "green" : ""}>{deliveryCharge === 0 ? 'Free' : `₹${deliveryCharge}`}</span>
               </div>
               <div className="p-row total-row">
                 <span>Total Amount</span>
                 <span>{formatPrice(finalAmount)}</span>
               </div>
               <div className="p-row savings-row">
                 You will save {formatPrice(discountTotal)} on this order
               </div>
            </div>
          </div>
          
          <div className="fk-security-trust">
            <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/shield_1d368e.png" alt="shield" />
            Safe and secure payments. Easy returns. 100% Authentic products.
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
