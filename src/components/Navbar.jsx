import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { cartItemCount } = useCart();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const openLoginModal = () => {
    setShowLoginModal(true);
    setShowRegisterModal(false);
  };

  const openRegisterModal = () => {
    setShowRegisterModal(true);
    setShowLoginModal(false);
  };

  const closeModals = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
  };

  const handleCartClick = () => {
    if (isAuthenticated) {
      navigate('/cart');
    } else {
      openLoginModal();
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-coffee fixed-top">
        <div className="container">
          <a className="navbar-brand" href="#" onClick={() => navigate('/')}>
            <i className="bi bi-cup-hot-fill me-2"></i>
            فروشگاه قهوه
          </a>
          
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" href="#" onClick={() => navigate('/')}>خانه</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#" onClick={() => navigate('/products')}>محصولات</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#about">درباره ما</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#contact">تماس با ما</a>
              </li>
              {isAuthenticated && user?.isAdmin && (
                <li className="nav-item">
                  <a className="nav-link" href="#" onClick={() => navigate('/admin/add-product')}>افزودن محصول</a>
                </li>
              )}
            </ul>
            <div className="d-flex align-items-center">
              <button 
                className="btn btn-outline-light me-2 position-relative"
                onClick={handleCartClick}
              >
                <i className="bi bi-cart3"></i>
                سبد خرید
                {cartItemCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cartItemCount}
                  </span>
                )}
              </button>
              
              {isAuthenticated ? (
                <div className="dropdown">
                  <button className="btn btn-light dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    <i className="bi bi-person-circle me-1"></i>
                    {user?.name || 'کاربر'}
                  </button>
                  <ul className="dropdown-menu">
                    <li><a className="dropdown-item" href="#profile">پروفایل</a></li>
                    <li><a className="dropdown-item" href="#orders">سفارشات</a></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item" onClick={handleLogout}>خروج</button></li>
                  </ul>
                </div>
              ) : (
                <div className="d-flex">
                  <button className="btn btn-outline-light me-2" onClick={openLoginModal}>
                    ورود
                  </button>
                  <button className="btn btn-light" onClick={openRegisterModal}>
                    ثبت نام
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <LoginModal 
        show={showLoginModal} 
        onClose={closeModals} 
        onSwitchToRegister={openRegisterModal}
      />
      
      <RegisterModal 
        show={showRegisterModal} 
        onClose={closeModals} 
        onSwitchToLogin={openLoginModal}
      />
    </>
  );
};

export default Navbar; 