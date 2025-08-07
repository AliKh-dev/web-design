import mongoose from 'mongoose';
import User from '../models/user.model.js';

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/coffee-shop';

const sampleUsers = [
  {
    name: 'مدیر سیستم',
    email: 'admin@coffee.com',
    password: 'admin123',
    isAdmin: true
  },
  {
    name: 'کاربر عادی',
    email: 'user@coffee.com',
    password: 'user123',
    isAdmin: false
  }
];

mongoose
  .connect(uri)
  .then(async () => {
    console.log('Connected to DB');

    for (const userData of sampleUsers) {
      try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
          console.log(`User ${userData.email} already exists, skipping...`);
          continue;
        }

        // Create new user
        const user = new User(userData);
        await user.save();
        console.log(`Created user: ${userData.email} (${userData.isAdmin ? 'Admin' : 'User'})`);
      } catch (error) {
        console.error(`Failed to create user ${userData.email}:`, error.message);
      }
    }

    await mongoose.disconnect();
    console.log('Disconnected from DB');
  })
  .catch((err) => {
    console.error('Seeding failed:', err);
  }); 