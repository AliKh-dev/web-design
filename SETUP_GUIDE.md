# Coffee Shop Project Setup Guide

## Project Overview
This is a full-stack coffee shop application with:
- **Frontend**: React.js with Bootstrap
- **Backend**: Node.js with Express and MongoDB
- **Features**: Product catalog, shopping cart

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or Docker)
- npm or yarn

## Setup Instructions

### 1. Environment Setup

#### Backend Environment Variables
Create a `.env` file in the `real-backend/shop-backend/` directory with the following content:

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/coffee-shop
```

### 2. Install Dependencies

#### Frontend Dependencies
```bash
# From the project root directory
npm install
```

#### Backend Dependencies
```bash
# Navigate to backend directory
cd real-backend/shop-backend
npm install
```

### 3. Database Setup

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. The application will automatically create the database

#### Option B: Docker (Recommended)
```bash
# Navigate to backend directory
cd real-backend/shop-backend

# Start MongoDB and backend with Docker
docker-compose up -d
```

### 4. Seed the Database
```bash
# Navigate to backend directory
cd real-backend/shop-backend

# Run the seed script to populate products
npm run seed
```

### 5. Start the Application

#### Start Backend (Terminal 1)
```bash
# Navigate to backend directory
cd real-backend/shop-backend

# Start in development mode
npm run dev
```

#### Start Frontend (Terminal 2)
```bash
# From the project root directory
npm start
```

### 6. Access the Application
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **MongoDB**: localhost:27017

## Project Structure

```
project/
├── src/                    # React frontend
│   ├── components/         # React components
│   ├── context/           # React context (Cart)
│   └── services/          # API services
├── real-backend/
│   └── shop-backend/      # Node.js backend
│       ├── controllers/   # Route controllers
│       ├── models/        # MongoDB models
│       ├── routes/        # API routes
│       └── middleware/    # Custom middleware
```

## Features

### Frontend
- Modern responsive design with Bootstrap
- Persian/Farsi language support
- Product catalog with filtering
- Shopping cart functionality
- Beautiful coffee-themed UI
- **Product ID Handling**: Uses `product.id` for product identification

### Backend
- RESTful API with Express.js
- MongoDB database with Mongoose
- Product management
- Cart management

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Cart
- `GET /api/cart` - Get cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/item/:id` - Update cart item
- `DELETE /api/cart/item/:id` - Remove item from cart
- `DELETE /api/cart/clear` - Clear cart

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check the MONGO_URI in .env file
   - Verify MongoDB port (27017) is available

2. **Port Already in Use**
   - Change PORT in .env file
   - Kill processes using the ports
   - Use different ports for frontend/backend

3. **CORS Issues**
   - Check that the frontend URL is in the allowed origins list
   - Verify the backend is running on the correct port

4. **API Connection Issues**
   - Ensure the backend server is running
   - Check the API_BASE_URL in the frontend
   - Verify network connectivity between frontend and backend

5. **Product ID Issues**
   - **Important**: The frontend now uses `product.id` instead of `product._id`
   - Ensure your backend API returns products with `id` field
   - Check that cart operations use the correct product ID format
   - Verify that product navigation URLs use the correct ID format 