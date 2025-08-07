import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { productsAPI } from '../services/api';

const AdminAddProductPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'general',
    weight: '',
    imageUrl: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    if (!isAdmin) {
      navigate('/');
      return;
    }
  }, [isAuthenticated, isAdmin, navigate]);

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning text-center" role="alert">
          <h4 className="alert-heading">دسترسی محدود</h4>
          <p>برای دسترسی به این صفحه باید مدیر باشید.</p>
          <button 
            className="btn btn-outline-warning" 
            onClick={() => navigate('/')}
          >
            بازگشت به صفحه اصلی
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('نام محصول الزامی است');
      return false;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      setError('قیمت باید عدد مثبت باشد');
      return false;
    }
    if (!formData.description.trim()) {
      setError('توضیحات محصول الزامی است');
      return false;
    }
    if (!formData.weight.trim()) {
      setError('وزن محصول الزامی است');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setMessage('');
    setError('');

    try {
      const productData = {
        ...formData,
        price: Number(formData.price)
      };

      await productsAPI.createProduct(productData);
      setMessage('محصول با موفقیت اضافه شد');
      
      // Reset form
      setFormData({
        name: '',
        price: '',
        description: '',
        category: 'general',
        weight: '',
        imageUrl: ''
      });

      // Redirect to products page after 2 seconds
      setTimeout(() => {
        navigate('/products');
      }, 2000);

    } catch (error) {
      console.error('Failed to create product:', error);
      setError(error.message || 'خطا در افزودن محصول');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card admin-form-card">
            <div className="card-header">
              <h3 className="mb-0">افزودن محصول جدید</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">نام محصول *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="price" className="form-label">قیمت (تومان) *</label>
                  <input
                    type="number"
                    className="form-control"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="1000"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">توضیحات *</label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    required
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label htmlFor="category" className="form-label">دسته‌بندی</label>
                  <select
                    className="form-select"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="general">عمومی</option>
                    <option value="روبوستا">روبوستا</option>
                    <option value="عربیکا">عربیکا</option>
                    <option value="میکس">میکس</option>
                    <option value="ترک">ترک</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="weight" className="form-label">وزن *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="weight"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    placeholder="مثال: 250 گرم"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="imageUrl" className="form-label">آدرس تصویر</label>
                  <input
                    type="url"
                    className="form-control"
                    id="imageUrl"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                  />
                  <div className="form-text">
                    اگر خالی باشد، تصویر پیش‌فرض استفاده می‌شود
                  </div>
                </div>

                {error && (
                  <div className="alert alert-danger mb-3">
                    {error}
                  </div>
                )}

                {message && (
                  <div className="alert alert-success mb-3">
                    {message}
                  </div>
                )}

                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-coffee"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        در حال افزودن...
                      </>
                    ) : (
                      'افزودن محصول'
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/products')}
                    disabled={isSubmitting}
                  >
                    انصراف
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAddProductPage; 