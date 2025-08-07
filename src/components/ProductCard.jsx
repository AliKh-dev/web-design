import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart, cart } = useCart();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [message, setMessage] = useState('');

  // Get current quantity in cart for this product
  const getCurrentQuantity = () => {
    if (!cart || !cart.items) return 0;
    const cartItem = cart.items.find(item => item.product.id === product.id);
    return cartItem ? cartItem.quantity : 0;
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      setMessage('برای افزودن به سبد خرید ابتدا وارد شوید');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    try {
      setIsAddingToCart(true);
      await addToCart(product.id, 1);
      setMessage('محصول به سبد خرید اضافه شد');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      setMessage('خطا در افزودن به سبد خرید');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleViewDetails = () => {
    navigate(`/product/${product.id}`);
  };

  const currentQuantity = getCurrentQuantity();

  // Function to handle image error
  const handleImageError = (e) => {
    e.target.style.display = 'none';
    e.target.nextSibling.style.display = 'block';
  };

  return (
    <div className="col-md-6 col-lg-4 col-xl-3 product-item">
      <div className="card product-card h-100">
        <div className="product-image">
          <div className="coffee-image-container">
            {/* Product Image */}
            <img 
              src={product.imageUrl || '/images/default-coffee.jpg'} 
              alt={product.name}
              className="product-img"
              onError={handleImageError}
              style={{ display: 'block' }}
            />
            {/* Fallback Coffee Icon */}
            <div className="coffee-icon-large" style={{ display: 'none' }}>☕</div>
            {currentQuantity > 0 && (
              <div className="cart-badge">
                <span className="badge bg-coffee-dark">{currentQuantity}</span>
              </div>
            )}
          </div>
          <span className="price-tag">
            {product.price.toLocaleString()} تومان
          </span>
        </div>
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{product.name}</h5>
          <span className="badge bg-secondary mb-2">{product.category}</span>
          <p className="card-text text-muted small mb-2">{product.weight}</p>
          <p className="card-text flex-grow-1">{product.description}</p>
          
          {message && (
            <div className={`alert alert-${message.includes('خطا') ? 'danger' : 'success'} alert-sm mb-3`}>
              {message}
            </div>
          )}
          
          <div className="d-flex justify-content-between mt-3">
            <button 
              className="btn btn-outline-coffee"
              onClick={handleViewDetails}
            >
              جزئیات
            </button>
            <button 
              className="btn btn-coffee"
              onClick={handleAddToCart}
              disabled={isAddingToCart}
            >
              <i className={`bi ${isAddingToCart ? 'bi-hourglass-split' : 'bi-cart-plus'} me-1`}></i>
              {isAddingToCart ? 'در حال افزودن...' : 'افزودن'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 