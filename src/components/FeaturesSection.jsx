import React from 'react';

const FeaturesSection = () => {
  const features = [
    {
      icon: "🌱",
      title: "کیفیت برتر",
      description: "دانه‌های قهوه با کیفیت از بهترین مزارع جهان"
    },
    {
      icon: "🔥",
      title: "برشته‌کاری تازه",
      description: "قهوه‌های ما به صورت هفتگی برشته می‌شوند"
    },
    {
      icon: "🚚",
      title: "ارسال سریع",
      description: "ارسال سریع به سراسر کشور در کمترین زمان"
    }
  ];

  return (
    <section className="py-5">
      <div className="container">
        <h2 className="section-title display-6 text-center mb-5">چرا ما را انتخاب کنید؟</h2>
        <div className="row g-4">
          {features.map((feature, index) => (
            <div key={index} className="col-md-4">
              <div className="card h-100 product-card text-center p-4">
                <div className="mb-3 fs-1">{feature.icon}</div>
                <h3 className="mb-3">{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection; 