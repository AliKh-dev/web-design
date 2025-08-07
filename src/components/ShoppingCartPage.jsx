import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const ShoppingCartPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { cart, updateCartItem, removeFromCart, clearCart, loading } = useCart();
  const [updatingItems, setUpdatingItems] = useState(new Set());
  const [removingItems, setRemovingItems] = useState(new Set());
  const [isClearing, setIsClearing] = useState(false);
  const [error, setError] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    setUpdatingItems(prev => new Set(prev).add(itemId));
    setError('');
    
    try {
      await updateCartItem(itemId, newQuantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
      setError('خطا در به‌روزرسانی تعداد محصول');
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const handleRemoveItem = async (itemId) => {
    setRemovingItems(prev => new Set(prev).add(itemId));
    setError('');
    
    try {
      await removeFromCart(itemId);
    } catch (error) {
      console.error('Failed to remove item:', error);
      setError('خطا در حذف محصول از سبد خرید');
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm('آیا مطمئن هستید که می‌خواهید سبد خرید را خالی کنید؟')) {
      return;
    }

    setIsClearing(true);
    setError('');
    
    try {
      await clearCart();
    } catch (error) {
      console.error('Failed to clear cart:', error);
      setError('خطا در خالی کردن سبد خرید');
    } finally {
      setIsClearing(false);
    }
  };

  // Function to handle image error
  const handleImageError = (e) => {
    e.target.style.display = 'none';
    e.target.nextSibling.style.display = 'block';
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 text-center">
            <div className="spinner-border text-coffee" role="status">
              <span className="visually-hidden">در حال بارگذاری...</span>
            </div>
            <p className="mt-3">در حال بارگذاری سبد خرید...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 text-center">
            <div className="mb-4">
              <i className="bi bi-cart-x display-1 text-muted"></i>
            </div>
            <h2 className="mb-3">سبد خرید شما خالی است</h2>
            <p className="text-muted mb-4">محصولات مورد نظر خود را به سبد خرید اضافه کنید</p>
            <button 
              className="btn btn-coffee"
              onClick={() => navigate('/products')}
            >
              مشاهده محصولات
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalPrice = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="container py-5">
      {error && (
        <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
          {error}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setError('')}
          ></button>
        </div>
      )}

      <div className="row">
        <div className="col-lg-8">
          <h1 className="mb-4">سبد خرید</h1>
          
          <div className="cart-items">
            {cart.items.map((item) => (
              <div key={item._id} className="card cart-item-card mb-3">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col-md-2">
                      <div className="product-image-small">
                        {/* Product Image */}
                        <img 
                          src={item.product.imageUrl || '/images/default-coffee.jpg'} 
                          alt={item.product.name}
                          className="w-100 h-100"
                          style={{ objectFit: 'cover', borderRadius: '8px' }}
                          onError={handleImageError}
                        />
                        {/* Fallback Coffee Icon */}
                        <div style={{ display: 'none' }}>☕</div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <h5 className="card-title mb-1">{item.product.name}</h5>
                      <p className="text-muted small mb-0">{item.product.weight}</p>
                      <span className="badge bg-secondary">{item.product.category}</span>
                    </div>
                    <div className="col-md-2">
                      <p className="mb-0 fw-bold">{item.price.toLocaleString()} تومان</p>
                    </div>
                    <div className="col-md-2">
                      <div className="input-group input-group-sm">
                        <button 
                          className="btn btn-outline-coffee" 
                          type="button"
                          onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                          disabled={item.quantity <= 1 || updatingItems.has(item._id)}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          className="form-control text-center"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value) || 1)}
                          min="1"
                          disabled={updatingItems.has(item._id)}
                          style={{ borderLeft: 'none', borderRight: 'none' }}
                        />
                        <button 
                          className="btn btn-outline-coffee" 
                          type="button"
                          onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                          disabled={updatingItems.has(item._id)}
                        >
                          +
                        </button>
                      </div>
                      {updatingItems.has(item._id) && (
                        <small className="text-muted">
                          <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                          در حال بروزرسانی...
                        </small>
                      )}
                    </div>
                    <div className="col-md-2">
                      <p className="mb-1 fw-bold">{(item.price * item.quantity).toLocaleString()} تومان</p>
                      <button 
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleRemoveItem(item._id)}
                        disabled={removingItems.has(item._id)}
                      >
                        {removingItems.has(item._id) ? (
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        ) : (
                          <i className="bi bi-trash"></i>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="d-flex justify-content-between align-items-center mt-4">
            <button 
              className="btn btn-outline-danger"
              onClick={handleClearCart}
              disabled={isClearing}
            >
              {isClearing ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  در حال پاک کردن...
                </>
              ) : (
                'خالی کردن سبد خرید'
              )}
            </button>
            <button 
              className="btn btn-outline-coffee"
              onClick={() => navigate('/products')}
            >
              ادامه خرید
            </button>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">خلاصه سفارش</h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>تعداد محصولات:</span>
                <span>{cart.items.length}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>مجموع تعداد:</span>
                <span>{cart.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3">
                <span className="fw-bold">مجموع کل:</span>
                <span className="fw-bold fs-5 text-coffee-dark">{totalPrice.toLocaleString()} تومان</span>
              </div>
              <button className="btn btn-coffee w-100" disabled>
                تکمیل سفارش
              </button>
              <small className="text-muted d-block text-center mt-2">
                این قابلیت در نسخه بعدی اضافه خواهد شد
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCartPage; 