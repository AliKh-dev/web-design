import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const LoginModal = ({ show, onClose, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, error, clearError } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    clearError();

    try {
      await login(formData);
      onClose();
    } catch (error) {
      console.error('Login failed:', error);
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
              <h5 className="modal-title">ورود به حساب کاربری</h5>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
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
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-coffee"
                    disabled={isLoading}
                  >
                    {isLoading ? 'در حال ورود...' : 'ورود'}
                  </button>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <p className="text-center mb-0">
                حساب کاربری ندارید؟{' '}
                <button 
                  type="button" 
                  className="btn btn-link p-0"
                  onClick={onSwitchToRegister}
                >
                  ثبت نام کنید
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginModal; 