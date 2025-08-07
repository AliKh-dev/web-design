import React from 'react';

const ContactSection = () => {
  const contactInfo = [
    {
      icon: "bi bi-geo-alt",
      title: "آدرس",
      value: "تهران، خیابان ولیعصر، پلاک 123"
    },
    {
      icon: "bi bi-telephone",
      title: "تلفن",
      value: "021-12345678"
    },
    {
      icon: "bi bi-envelope",
      title: "ایمیل",
      value: "info@coffeeshop.com"
    }
  ];

  return (
    <section className="py-5 bg-white" id="contact">
      <div className="container">
        <h2 className="section-title display-6 text-center mb-5">تماس با ما</h2>
        <div className="row g-4 justify-content-center">
          <div className="col-lg-8">
            {contactInfo.map((info, index) => (
              <div key={index} className="d-flex align-items-center mb-4">
                <div className="me-3 p-3 rounded-circle" style={{backgroundColor: 'var(--coffee-light)', color: 'white'}}>
                  <i className={`${info.icon} fs-4`}></i>
                </div>
                <div>
                  <h5 className="mb-1">{info.title}</h5>
                  <p className="mb-0">{info.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection; 