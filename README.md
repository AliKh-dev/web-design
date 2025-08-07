# فروشگاه قهوه (Coffee Shop) - React App

A modern, responsive coffee shop website built with React, featuring Persian/Farsi support and dynamic product management.

## 🚀 Features

- **React Components**: Modular, reusable components
- **Dynamic Products**: Products fetched from Node.js backend API
- **Shopping Cart**: Add products to cart with real-time updates
- **Responsive Design**: Works perfectly on all device sizes
- **Product Filtering**: Filter products by category (Robusta, Arabica, Mix, Turkish)
- **Modern UI**: Beautiful coffee-themed design with Persian/Farsi support
- **Interactive Elements**: Hover effects, smooth transitions, and dynamic content
- **Bootstrap Integration**: Built with Bootstrap 5 for consistent styling

## 📁 Project Structure

```
canva2/
├── public/
│   └── index.html          # Main HTML template
├── src/
│   ├── components/         # React components
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── ProductCard.jsx
│   │   ├── ProductsSection.jsx
│   │   ├── AboutSection.jsx
│   │   ├── FeaturesSection.jsx
│   │   ├── ContactSection.jsx
│   │   └── Footer.jsx
│   ├── context/
│   │   └── CartContext.jsx # Cart context
│   ├── services/
│   │   └── api.js          # API service functions
│   ├── App.jsx             # Main App component
│   ├── index.js            # React entry point
│   └── index.css           # Global styles
├── real-backend/           # Your actual Node.js backend
│   └── shop-backend/       # Backend application
│       ├── routes/         # API routes
│       ├── controllers/    # Business logic
│       ├── models/         # Database models
│       ├── middleware/     # Custom middleware
│       ├── scripts/        # Database scripts
│       ├── index.js        # Main server file
│       ├── package.json    # Backend dependencies
│       ├── Dockerfile      # Docker configuration
│       └── docker-compose.yml # Docker services
├── package.json            # Frontend dependencies and scripts
└── README.md               # Project documentation
```

## 🛠️ Technologies Used

### Frontend
- **React 18.2.0** - Modern React with hooks
- **Bootstrap 5.3.0** - CSS framework
- **Bootstrap Icons 1.10.5** - Icon library
- **Google Fonts** - Vazirmatn for Persian text
- **CSS3** - Custom properties and animations

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **CORS** - Cross-origin resource sharing

## 📦 Installation & Setup

### Frontend Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm start
   ```

3. **Open your browser** and navigate to `http://localhost:3000`

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd real-backend/shop-backend
   ```

2. **Start with Docker** (Recommended):
   ```bash
   docker-compose up -d
   ```

3. **Or install dependencies manually**:
   ```bash
   npm install
   npm start
   ```

4. **Set up MongoDB**:
   - MongoDB is included in Docker setup
   - Or install MongoDB locally
   - Update connection string in `server.js`

4. **Start backend server**:
   ```bash
   npm run dev
   ```

## 🎯 Key Features

### Product Management
- **Dynamic Product Loading**: Products loaded from backend API
- **Product Filtering**: Filter by category and search terms
- **Product Details**: Detailed view with descriptions and pricing
- **Add to Cart**: Seamless cart integration

### Shopping Cart
- **Real-time Updates**: Cart updates instantly when items are added
- **Quantity Management**: Adjust quantities in cart
- **Cart Persistence**: Cart items maintained across sessions
- **Cart Summary**: Total calculation and item count

### User Experience
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Persian Language**: Full Persian/Farsi support
- **Modern UI**: Clean, coffee-themed design
- **Smooth Navigation**: Intuitive user interface

## 🔧 Development

### Frontend Development
- **Component-based Architecture**: Modular, reusable components
- **Context API**: State management for cart functionality
- **API Integration**: RESTful API communication
- **Responsive Design**: Mobile-first approach
- **Product ID Handling**: Uses `product.id` for product identification (updated from `product._id`)

### Backend Development
- **RESTful API**: Clean, RESTful endpoints
- **MongoDB Integration**: NoSQL database with Mongoose
- **Error Handling**: Comprehensive error management
- **CORS Support**: Cross-origin resource sharing

## 🚀 Deployment

### Frontend Deployment
1. Build the project: `npm run build`
2. Deploy the `build` folder to your hosting service
3. Configure environment variables for production

### Backend Deployment
1. Set up environment variables
2. Deploy to your preferred hosting service
3. Configure MongoDB connection
4. Set up proper CORS settings

## 📝 API Endpoints

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

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Bootstrap for the UI framework
- React team for the amazing framework
- MongoDB for the database solution
- Express.js for the backend framework 