import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { connectToDB } from './db/mongoClient.js';
import productRoutes from './routes/products.js';
import authRoutes from './routes/auth.js';
import cartRoutes from './routes/cart.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000', 
    'http://localhost:3001', 
    'http://localhost:3002', 
    'http://127.0.0.1:3000', 
    'http://127.0.0.1:3001', 
    'http://127.0.0.1:3002',
    'http://192.168.1.100:3000',
    'http://192.168.1.100:3001'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// Serve static files for images
app.use('/images', express.static('public/images'));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Coffee Shop API is running',
    timestamp: new Date().toISOString()
  });
});

connectToDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
    console.log(`Health check available at http://localhost:${port}/api/health`);
  });
}).catch((err) => {
  console.error('Failed to start server:', err);
});
