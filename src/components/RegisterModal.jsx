import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const RegisterModal = ({ show, onClose, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  
  const { register, error, clearError } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setValidationError('');
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setValidationError('رمز عبور و تکرار آن مطابقت ندارند');
      return false;
    }
    if (formData.password.length < 6) {
      setValidationError('رمز عبور باید حداقل 6 کاراکتر باشد');
      return false;
    }
    if (formData.name.length < 2) {
      setValidationError('نام باید حداقل 2 کاراکتر باشد');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    clearError();

    try {
      const { confirmPassword, ...userData } = formData;
      await register(userData);
      onClose();
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!show) return null;

  return (
    <>
      <div className="modal-backdrop fade show"></div>
      <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="btn-close" onClick={onClose}></button>
              <h5 className="modal-title">ثبت نام</h5>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">نام</label>
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
                  <label htmlFor="email" className="form-label">ایمیل</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">رمز عبور</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">تکرار رمز عبور</label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
                {(error || validationError) && (
                  <div className="alert alert-danger" role="alert">
                    {error || validationError}
                  </div>
                )}
                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-coffee"
                    disabled={isLoading}
                  >
                    {isLoading ? 'در حال ثبت نام...' : 'ثبت نام'}
                  </button>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <p className="text-center mb-0">
                قبلاً ثبت نام کرده‌اید؟{' '}
                <button 
                  type="button" 
                  className="btn btn-link p-0"
                  onClick={onSwitchToLogin}
                >
                  وارد شوید
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterModal; 