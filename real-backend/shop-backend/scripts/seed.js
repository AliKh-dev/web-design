import mongoose from 'mongoose';
import Product from '../models/product.model.js';

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/coffee-shop';

const sampleProducts = [
  // روبوستا
  { name: "اندونزی", weight: "250 گرم", price: 255, description: "قهوه روبوستا اندونزی با طعم قوی و گیرایی بالا", category: "روبوستا", imageUrl: "/images/اندونزی.jpg" },
  { name: "ویتنام", weight: "250 گرم", price: 215, description: "روبوستای کلاسیک ویتنام، طعمی تلخ و پرکافئین", category: "روبوستا", imageUrl: "/images/ویتنام.jpg" },
  { name: "پی بی", weight: "250 گرم", price: 265, description: "قهوه روبوستا با دانه‌های گوشتی‌تر (Peaberry)", category: "روبوستا", imageUrl: "/images/پی بی.jpg" },
  { name: "چری", weight: "250 گرم", price: 205, description: "روبوستای اقتصادی با طعمی تلخ و ساده", category: "روبوستا", imageUrl: "/images/چری.jpg" },
  { name: "اوگاندا", weight: "250 گرم", price: 235, description: "روبوستای آفریقایی، گیرایی بالا", category: "روبوستا", imageUrl: "/images/اوگاندا.jpg" },
  { name: "میکس 100٪ روبوستا", weight: "250 گرم", price: 245, description: "ترکیب کامل روبوستا، مناسب اسپرسو", category: "روبوستا", imageUrl: "/images/میکس 100٪ روبوستا .jpg" },
  { name: "میکس اقتصادی 100٪ روبوستا", weight: "250 گرم", price: 218, description: "مناسب مصارف بالا، قیمت اقتصادی", category: "روبوستا", imageUrl: "/images/میکس اقتصادی 100٪ روبوستا .jpg" },

  // عربیکا
  { name: "پرو", weight: "250 گرم", price: 360, description: "عطر ملایم، اسیدیته پایین", category: "عربیکا", imageUrl: "/images/پرو.jpg" },
  { name: "برزیل ریو", weight: "250 گرم", price: 295, description: "عربیکای مشهور با طعم ملایم و متعادل", category: "عربیکا", imageUrl: "/images/برزیل ریو.jpg" },
  { name: "برزیل سانتوس", weight: "250 گرم", price: 285, description: "عطر دلنشین، تلخی کم", category: "عربیکا", imageUrl: "/images/برزیل سانتوس.jpg" },
  { name: "کلمبیا سوپریمو", weight: "250 گرم", price: 285, description: "اسیدیته متوسط، شیرینی طبیعی", category: "عربیکا", imageUrl: "/images/کلمبیا سوپریمو.jpg" },
  { name: "کنیا AA", weight: "250 گرم", price: 345, description: "قهوه قوی و عطردار با اسیدیته بالا", category: "عربیکا", imageUrl: "/images/کنیا AA.jpg" },
  { name: "اتیوپی لیمو", weight: "250 گرم", price: 340, description: "رایحه گلی و اسیدیته روشن", category: "عربیکا", imageUrl: "/images/اتیوپی لیمو.jpg" },
  { name: "میکس 100٪ عربیکا", weight: "250 گرم", price: 310, description: "مناسب برای طعم‌دوستان عربیکا خالص", category: "عربیکا", imageUrl: "/images/میکس 100٪ عربیکا.jpg" },

  // میکس
  { name: "میکس 10/90", weight: "250 گرم", price: 245, description: "10٪ عربیکا + 90٪ روبوستا", category: "میکس", imageUrl: "/images/میکس 1090.jpg" },
  { name: "میکس 20/80", weight: "250 گرم", price: 255, description: "20٪ عربیکا + 80٪ روبوستا", category: "میکس", imageUrl: "/images/میکس 2080.png" },
  { name: "میکس اقتصادی 20/80", weight: "250 گرم", price: 230, description: "نسخه اقتصادی با همان ترکیب", category: "میکس", imageUrl: "/images/میکس اقتصادی 2080 .png" },
  { name: "میکس ویتنام", weight: "250 گرم", price: 305, description: "ترکیب روبوستا غالب از ویتنام", category: "میکس", imageUrl: "/images/میکس ویتنام.png" },
  { name: "میکس ویتنام 30/70", weight: "250 گرم", price: 270, description: "30٪ عربیکا + 70٪ روبوستا", category: "میکس", imageUrl: "/images/میکس ویتنام 3070 .png" },
  { name: "میکس ویژه 30/70", weight: "250 گرم", price: 290, description: "ترکیب ویژه با تلخی متوسط", category: "میکس", imageUrl: "/images/میکس ویژه 3070 .png" },
  { name: "میکس 40/60", weight: "250 گرم", price: 280, description: "متناسب برای اسپرسو متعادل", category: "میکس", imageUrl: "/images/میکس 4060 .png" },
  { name: "میکس 50/50", weight: "250 گرم", price: 335, description: "نیم‌نیم روبوستا و عربیکا", category: "میکس", imageUrl: "/images/میکس 5050 .png" },
  { name: "میکس 70/30", weight: "250 گرم", price: 320, description: "بیشتر عربیکا، طعم متعادل", category: "میکس", imageUrl: "/images/میکس7030.jpg" },

  // ترک
  { name: "ترک", weight: "250 گرم", price: 250, description: "قهوه کلاسیک ترک با طعمی نرم", category: "ترک", imageUrl: "/images/ترک .jpg" },
  { name: "ترک ویتنام", weight: "250 گرم", price: 245, description: "ترکیب سبک ترک با قهوه ویتنامی", category: "ترک", imageUrl: "/images/ترک ویتنام.jpg" },
  { name: "ترک ویژه", weight: "250 گرم", price: 310, description: "طعم غلیظ‌تر و با کیفیت ویژه", category: "ترک", imageUrl: "/images/ترک ویژه.jpg" },
];

mongoose
  .connect(uri)
  .then(async () => {
    console.log('Connected to DB');

    await Product.deleteMany();
    console.log('Old products deleted');

    const inserted = await Product.insertMany(sampleProducts);
    console.log(`Inserted ${inserted.length} products`);

    await mongoose.disconnect();
    console.log('Disconnected from DB');
  })
  .catch((err) => {
    console.error('Seeding failed:', err);
  });