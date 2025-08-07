import React, { useState, useEffect } from 'react';
import { productsAPI } from '../services/api';
import ProductCard from './ProductCard';

const ProductsSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  const categories = ['all', 'روبوستا', 'عربیکا', 'میکس', 'ترک'];
  const categoryLabels = {
    'all': 'همه',
    'روبوستا': 'روبوستا',
    'عربیکا': 'عربیکا',
    'میکس': 'میکس',
    'ترک': 'ترک'
  };

  // Fetch products from backend
  const fetchProducts = async (params = {limit: 26}) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching products with params:', params);
      const response = await productsAPI.getAllProducts(params);
      console.log('API Response:', response);
      
      // Your backend returns { total, page, pageSize, products }
      const productsData = response.products || response;
      console.log('Products data:', productsData);
      setProducts(productsData);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setError('خطا در بارگذاری محصولات');
    } finally {
      setLoading(false);
    }
  };

  // Load products on component mount
  useEffect(() => {
    console.log('ProductsSection mounted, fetching products...');
    fetchProducts();
    
    // Test API connection
    fetch('http://localhost:3001/api/products')
      .then(response => {
        console.log('Direct fetch response status:', response.status);
        return response.json();
      })
      .then(data => {
        console.log('Direct fetch data:', data);
      })
      .catch(error => {
        console.error('Direct fetch error:', error);
      });
  }, []);

  const handleFilterClick = (category) => {
    setActiveFilter(category);
    // Since your backend doesn't have category filtering, we'll filter client-side
    fetchProducts();
  };

  const handleSearch = (search) => {
    setSearchTerm(search);
    if (search) {
      fetchProducts({ search });
    } else {
      fetchProducts();
    }
  };

  const handlePriceFilter = (min, max) => {
    setPriceRange({ min, max });
    const params = {};
    if (min) params.minPrice = min;
    if (max) params.maxPrice = max;
    fetchProducts(params);
  };

  // Filter products client-side for categories (since backend doesn't support it)
  const filteredProducts = activeFilter === 'all' 
    ? products 
    : products.filter(product => {
        // Since your product model doesn't have category, we'll filter by name/description
        const productText = `${product.name} ${product.description}`.toLowerCase();
        return productText.includes(activeFilter.toLowerCase());
      });

  if (loading) {
    return (
      <section className="py-5" id="products">
        <div className="container">
          <h2 className="section-title display-6 text-center mb-5">محصولات ما</h2>
          <div className="text-center">
            <div className="spinner-border text-coffee-light" role="status">
              <span className="visually-hidden">در حال بارگذاری...</span>
            </div>
            <p className="mt-3">در حال بارگذاری محصولات...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-5" id="products">
        <div className="container">
          <h2 className="section-title display-6 text-center mb-5">محصولات ما</h2>
          <div className="alert alert-danger text-center" role="alert">
            {error}
            <button 
              className="btn btn-outline-danger ms-3" 
              onClick={() => fetchProducts()}
            >
              تلاش مجدد
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-5" id="products">
      <div className="container">
        <h2 className="section-title display-6 text-center mb-5">محصولات ما</h2>
        
        {/* Filter Buttons */}
        <div className="d-flex justify-content-center flex-wrap mb-5">
          {categories.map(category => (
            <button
              key={category}
              className={`filter-btn mx-2 mb-2 ${activeFilter === category ? 'active' : ''}`}
              onClick={() => handleFilterClick(category)}
            >
              {categoryLabels[category]}
            </button>
          ))}
        </div>
        
        {/* Products Grid */}
        <div className="row g-4" id="products-container">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
                              <ProductCard key={product.id || index} product={product} />
            ))
          ) : (
            <div className="col-12 text-center">
              <p className="text-muted">محصولی در این دسته‌بندی یافت نشد.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection; 