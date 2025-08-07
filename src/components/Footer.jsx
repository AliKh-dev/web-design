import React from 'react';

const Footer = () => {
  const quickLinks = [
    { href: "#", text: "خانه" },
    { href: "#products", text: "محصولات" },
    { href: "#about", text: "درباره ما" },
    { href: "#contact", text: "تماس با ما" }
  ];

  const socialLinks = [
    { href: "#", icon: "bi bi-instagram" },
    { href: "#", icon: "bi bi-telegram" },
    { href: "#", icon: "bi bi-twitter" }
  ];

  return (
    <footer className="footer">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-6 col-md-6">
            <h4 className="footer-title">فروشگاه قهوه</h4>
            <p className="mb-4">بهترین قهوه‌های دنیا را با ما تجربه کنید.</p>
            <div className="d-flex">
              {socialLinks.map((social, index) => (
                <a key={index} href={social.href} className="btn btn-outline-light me-2">
                  <i className={social.icon}></i>
                </a>
              ))}
            </div>
          </div>
          <div className="col-lg-6 col-md-6">
            <h4 className="footer-title">دسترسی سریع</h4>
            <ul className="list-unstyled">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="footer-link">{link.text}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <hr className="my-4" style={{borderColor: 'rgba(255, 255, 255, 0.1)'}} />
        <div className="text-center">
          <p className="mb-0">© تمامی حقوق محفوظ است - فروشگاه قهوه 1404</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 