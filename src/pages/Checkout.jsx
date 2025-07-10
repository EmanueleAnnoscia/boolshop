
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ordersAPI, couponsAPI } from '../services/api';
import mockData from '../data/mockProducts.json';
import styles from './Checkout.module.css';

const Checkout = () => {
  const { cart, discount, dispatch } = useAppContext();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Italia',
    shippingAddress: '',
    shippingCity: '',
    shippingPostalCode: '',
    useShippingAddress: false,
    paymentMethod: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    terms: false
  });

  const [errors, setErrors] = useState({});

  if (cart.length === 0) {
    return (
      <div className={styles.emptyCheckout}>
        <div className={styles.container}>
          <h2>Carrello vuoto</h2>
          <p>Aggiungi prodotti al carrello per procedere al checkout.</p>
          <button onClick={() => navigate('/gallery')} className={styles.backButton}>
            Vai alla galleria
          </button>
        </div>
      </div>
    );
  }

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'Nome richiesto';
    if (!formData.lastName.trim()) newErrors.lastName = 'Cognome richiesto';
    if (!formData.email.trim()) newErrors.email = 'Email richiesta';
    if (!formData.phone.trim()) newErrors.phone = 'Telefono richiesto';
    if (!formData.address.trim()) newErrors.address = 'Indirizzo richiesto';
    if (!formData.city.trim()) newErrors.city = 'Città richiesta';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'CAP richiesto';
    if (!formData.terms) newErrors.terms = 'Accettare i termini e condizioni';
    
    if (formData.paymentMethod === 'card') {
      if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Numero carta richiesto';
      if (!formData.expiryDate.trim()) newErrors.expiryDate = 'Data scadenza richiesta';
      if (!formData.cvv.trim()) newErrors.cvv = 'CVV richiesto';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setCouponError('');
    
    try {
      // Simulate API call
      const coupon = mockData.coupons.find(c => c.code === couponCode.toUpperCase());
      
      if (!coupon) {
        setCouponError('Codice sconto non valido');
        return;
      }
      
      const now = new Date();
      const validFrom = new Date(coupon.validFrom);
      const validTo = new Date(coupon.validTo);
      
      if (now < validFrom || now > validTo) {
        setCouponError('Codice sconto scaduto');
        return;
      }
      
      const subtotal = getSubtotal();
      if (subtotal < coupon.minAmount) {
        setCouponError(`Importo minimo ${formatPrice(coupon.minAmount)} per questo codice`);
        return;
      }
      
      dispatch({ type: 'SET_DISCOUNT', payload: coupon });
      setCouponCode('');
    } catch (error) {
      setCouponError('Errore nella validazione del codice');
    }
  };

  const removeCoupon = () => {
    dispatch({ type: 'SET_DISCOUNT', payload: null });
  };

  const getSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getDiscountAmount = () => {
    if (!discount) return 0;
    const subtotal = getSubtotal();
    return discount.type === 'percentage' 
      ? (subtotal * discount.discount / 100)
      : discount.discount;
  };

  const getShippingCost = () => {
    const subtotal = getSubtotal();
    return subtotal >= 75 ? 0 : 5.99;
  };

  const getTotal = () => {
    return getSubtotal() - getDiscountAmount() + getShippingCost();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // Check stock availability
    const stockErrors = [];
    cart.forEach(item => {
      const product = mockData.products.find(p => p.id === item.id);
      if (!product || product.inStock < item.quantity) {
        stockErrors.push(item.name);
      }
    });
    
    if (stockErrors.length > 0) {
      alert(`I seguenti prodotti non sono più disponibili: ${stockErrors.join(', ')}`);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const orderData = {
        items: cart,
        customer: formData,
        discount: discount,
        total: getTotal()
      };
      
      await ordersAPI.create(orderData);
      
      // Clear cart
      dispatch({ type: 'CLEAR_CART' });
      dispatch({ type: 'SET_DISCOUNT', payload: null });
      
      // Simulate sending confirmation emails
      console.log('Sending confirmation email to customer:', formData.email);
      console.log('Sending order notification to store');
      
      alert('Ordine confermato! Riceverai un\'email di conferma a breve.');
      navigate('/');
      
    } catch (error) {
      alert('Errore durante l\'elaborazione dell\'ordine. Riprova.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.checkout}>
      <div className={styles.container}>
        <h1 className={styles.title}>Checkout</h1>
        
        <div className={styles.checkoutGrid}>
          <div className={styles.checkoutForm}>
            <form onSubmit={handleSubmit}>
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Informazioni di contatto</h2>
                <div className={styles.formGrid}>
                  <div className={styles.inputGroup}>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="Nome *"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={errors.firstName ? styles.inputError : ''}
                    />
                    {errors.firstName && <span className={styles.error}>{errors.firstName}</span>}
                  </div>
                  
                  <div className={styles.inputGroup}>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Cognome *"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={errors.lastName ? styles.inputError : ''}
                    />
                    {errors.lastName && <span className={styles.error}>{errors.lastName}</span>}
                  </div>
                  
                  <div className={styles.inputGroup}>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email *"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={errors.email ? styles.inputError : ''}
                    />
                    {errors.email && <span className={styles.error}>{errors.email}</span>}
                  </div>
                  
                  <div className={styles.inputGroup}>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Telefono *"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={errors.phone ? styles.inputError : ''}
                    />
                    {errors.phone && <span className={styles.error}>{errors.phone}</span>}
                  </div>
                </div>
              </div>

              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Indirizzo di fatturazione</h2>
                <div className={styles.formGrid}>
                  <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                    <input
                      type="text"
                      name="address"
                      placeholder="Indirizzo *"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={errors.address ? styles.inputError : ''}
                    />
                    {errors.address && <span className={styles.error}>{errors.address}</span>}
                  </div>
                  
                  <div className={styles.inputGroup}>
                    <input
                      type="text"
                      name="city"
                      placeholder="Città *"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={errors.city ? styles.inputError : ''}
                    />
                    {errors.city && <span className={styles.error}>{errors.city}</span>}
                  </div>
                  
                  <div className={styles.inputGroup}>
                    <input
                      type="text"
                      name="postalCode"
                      placeholder="CAP *"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className={errors.postalCode ? styles.inputError : ''}
                    />
                    {errors.postalCode && <span className={styles.error}>{errors.postalCode}</span>}
                  </div>
                </div>
              </div>

              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Metodo di pagamento</h2>
                
                <div className={styles.paymentMethods}>
                  <label className={styles.paymentMethod}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleInputChange}
                    />
                    <span>💳 Carta di credito</span>
                  </label>
                  
                  <label className={styles.paymentMethod}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      checked={formData.paymentMethod === 'paypal'}
                      onChange={handleInputChange}
                    />
                    <span>🅿️ PayPal</span>
                  </label>
                </div>

                {formData.paymentMethod === 'card' && (
                  <div className={styles.cardForm}>
                    <div className={styles.inputGroup}>
                      <input
                        type="text"
                        name="cardNumber"
                        placeholder="Numero carta *"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        className={errors.cardNumber ? styles.inputError : ''}
                      />
                      {errors.cardNumber && <span className={styles.error}>{errors.cardNumber}</span>}
                    </div>
                    
                    <div className={styles.formGrid}>
                      <div className={styles.inputGroup}>
                        <input
                          type="text"
                          name="expiryDate"
                          placeholder="MM/AA *"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          className={errors.expiryDate ? styles.inputError : ''}
                        />
                        {errors.expiryDate && <span className={styles.error}>{errors.expiryDate}</span>}
                      </div>
                      
                      <div className={styles.inputGroup}>
                        <input
                          type="text"
                          name="cvv"
                          placeholder="CVV *"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          className={errors.cvv ? styles.inputError : ''}
                        />
                        {errors.cvv && <span className={styles.error}>{errors.cvv}</span>}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.section}>
                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    name="terms"
                    checked={formData.terms}
                    onChange={handleInputChange}
                  />
                  <span>Accetto i termini e condizioni *</span>
                </label>
                {errors.terms && <span className={styles.error}>{errors.terms}</span>}
              </div>

              <button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Elaborazione...' : `Conferma Ordine - ${formatPrice(getTotal())}`}
              </button>
            </form>
          </div>

          <div className={styles.orderSummary}>
            <div className={styles.summaryCard}>
              <h3 className={styles.summaryTitle}>Riepilogo Ordine</h3>
              
              <div className={styles.orderItems}>
                {cart.map(item => (
                  <div key={item.id} className={styles.orderItem}>
                    <div className={styles.itemImage}>
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className={styles.itemDetails}>
                      <span className={styles.itemName}>{item.name}</span>
                      <span className={styles.itemQuantity}>Qty: {item.quantity}</span>
                    </div>
                    <span className={styles.itemPrice}>
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className={styles.couponSection}>
                <div className={styles.couponInput}>
                  <input
                    type="text"
                    placeholder="Codice sconto"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={!!discount}
                  />
                  <button 
                    type="button" 
                    onClick={applyCoupon}
                    disabled={!!discount || !couponCode.trim()}
                  >
                    Applica
                  </button>
                </div>
                {couponError && <span className={styles.error}>{couponError}</span>}
                {discount && (
                  <div className={styles.appliedCoupon}>
                    <span>Codice "{discount.code}" applicato</span>
                    <button type="button" onClick={removeCoupon}>✕</button>
                  </div>
                )}
              </div>
              
              <div className={styles.summaryRows}>
                <div className={styles.summaryRow}>
                  <span>Subtotale</span>
                  <span>{formatPrice(getSubtotal())}</span>
                </div>
                
                {discount && (
                  <div className={styles.summaryRow}>
                    <span>Sconto ({discount.code})</span>
                    <span className={styles.discount}>-{formatPrice(getDiscountAmount())}</span>
                  </div>
                )}
                
                <div className={styles.summaryRow}>
                  <span>Spedizione</span>
                  <span>
                    {getShippingCost() === 0 ? (
                      <span className={styles.freeShipping}>Gratuita</span>
                    ) : (
                      formatPrice(getShippingCost())
                    )}
                  </span>
                </div>
                
                <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                  <span>Totale</span>
                  <span>{formatPrice(getTotal())}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
