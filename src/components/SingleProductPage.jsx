import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { productsAPI } from '../services/api';

const SingleProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart, cart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [message, setMessage] = useState('');

  // Get current quantity in cart for this product
  const getCurrentQuantity = () => {
    if (!cart || !cart.items || !product) return 0;
    const cartItem = cart.items.find(item => item.product._id === product.id);
    return cartItem ? cartItem.quantity : 0;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const productData = await productsAPI.getProduct(id);
        setProduct(productData);
      } catch (error) {
        console.error('Failed to fetch product:', error);
        setError('خطا در بارگذاری محصول');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      setMessage('برای افزودن به سبد خرید ابتدا وارد شوید');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    try {
      setIsAddingToCart(true);
      await addToCart(product.id, quantity);
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

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
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
            <p className="mt-3">در حال بارگذاری محصول...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="alert alert-danger text-center" role="alert">
              <h4 className="alert-heading">خطا!</h4>
              <p>{error || 'محصول یافت نشد'}</p>
              <button 
                className="btn btn-outline-danger" 
                onClick={() => navigate('/products')}
              >
                بازگشت به محصولات
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuantity = getCurrentQuantity();

  return (
    <div className="container py-5">
      <div className="row">
        {/* Product Image */}
        <div className="col-lg-6 mb-4">
          <div className="product-detail-image">
            <div className="large-product-image">
              {/* Product Image */}
              <img 
                src={product.imageUrl || '/images/default-coffee.jpg'} 
                alt={product.name}
                className="large-product-img"
                onError={handleImageError}
                style={{ display: 'block' }}
              />
              {/* Fallback Coffee Icon */}
              <div className="coffee-icon-large" style={{ display: 'none' }}>☕</div>
              {currentQuantity > 0 && (
                <div className="cart-badge-large">
                  <span className="badge bg-coffee-dark fs-6">
                    در سبد خرید: {currentQuantity}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="col-lg-6">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <button 
                  className="btn btn-link p-0" 
                  onClick={() => navigate('/products')}
                >
                  محصولات
                </button>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {product.name}
              </li>
            </ol>
          </nav>

          <h1 className="display-5 fw-bold mb-3">{product.name}</h1>
          
          <div className="mb-3">
            <span className="badge bg-coffee-light fs-6 px-3 py-2">
              {product.weight}
            </span>
            <span className="badge bg-secondary fs-6 px-3 py-2 ms-2">
              {product.category}
            </span>
          </div>

          <div className="mb-4">
            <h2 className="text-coffee-dark fw-bold">
              {product.price.toLocaleString()} تومان
            </h2>
          </div>

          <div className="mb-4">
            <h5>توضیحات محصول:</h5>
            <div className="product-description">
              <p className="text-muted">{product.description}</p>
            </div>
          </div>

          {message && (
            <div className={`alert alert-${message.includes('خطا') ? 'danger' : 'success'} mb-4`}>
              {message}
            </div>
          )}

          <div className="d-flex align-items-center mb-4">
            <label htmlFor="quantity" className="me-3 fw-bold">تعداد:</label>
            <div className="input-group" style={{ width: '150px' }}>
              <button 
                className="btn btn-outline-coffee" 
                type="button"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
              >
                -
              </button>
              <input
                type="number"
                className="form-control text-center"
                id="quantity"
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                min="1"
                style={{ borderLeft: 'none', borderRight: 'none' }}
              />
              <button 
                className="btn btn-outline-coffee" 
                type="button"
                onClick={() => handleQuantityChange(quantity + 1)}
              >
                +
              </button>
            </div>
          </div>

          <div className="d-grid gap-2">
            <button 
              className="btn btn-coffee btn-lg"
              onClick={handleAddToCart}
              disabled={isAddingToCart}
            >
              {isAddingToCart ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  در حال افزودن...
                </>
              ) : (
                <>
                  <i className="bi bi-cart-plus me-2"></i>
                  افزودن به سبد خرید
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProductPage; 