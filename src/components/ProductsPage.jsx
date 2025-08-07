import React, { useState, useEffect } from 'react';
import { productsAPI } from '../services/api';
import ProductCard from './ProductCard';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await productsAPI.getAllProducts(params);
      setProducts(response.products || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setError('خطا در دریافت محصولات. لطفاً دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (categoryFilter !== 'all') params.category = categoryFilter;
    if (priceRange.min) params.minPrice = priceRange.min;
    if (priceRange.max) params.maxPrice = priceRange.max;
    
    fetchProducts(params);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setPriceRange({ min: '', max: '' });
    fetchProducts();
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 text-center">
            <div className="spinner-border text-coffee" role="status">
              <span className="visually-hidden">در حال بارگذاری...</span>
            </div>
            <p className="mt-3">در حال بارگذاری محصولات...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="alert alert-danger text-center" role="alert">
              <h4 className="alert-heading">خطا!</h4>
              <p>{error}</p>
              <button 
                className="btn btn-outline-danger" 
                onClick={() => fetchProducts()}
              >
                تلاش مجدد
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <h1 className="text-center mb-5">محصولات ما</h1>
          
          {/* Search and Filter Section */}
          <div className="card mb-4">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="جستجو در محصولات..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <div className="col-md-3">
                  <select
                    className="form-select"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="all">همه دسته‌ها</option>
                    <option value="روبوستا">روبوستا</option>
                    <option value="عربیکا">عربیکا</option>
                    <option value="میکس">میکس</option>
                    <option value="ترک">ترک</option>
                  </select>
                </div>
                <div className="col-md-2">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="حداقل قیمت"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                  />
                </div>
                <div className="col-md-2">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="حداکثر قیمت"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                  />
                </div>
                <div className="col-md-1">
                  <button className="btn btn-coffee w-100" onClick={handleSearch}>
                    <i className="bi bi-search"></i>
                  </button>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-12">
                  <button 
                    className="btn btn-outline-secondary btn-sm me-2" 
                    onClick={handleClearFilters}
                  >
                    پاک کردن فیلترها
                  </button>
                  <div className="btn-group float-end" role="group">
                    <button
                      type="button"
                      className={`btn btn-outline-coffee ${viewMode === 'grid' ? 'active' : ''}`}
                      onClick={() => setViewMode('grid')}
                    >
                      <i className="bi bi-grid-3x3-gap"></i>
                    </button>
                    <button
                      type="button"
                      className={`btn btn-outline-coffee ${viewMode === 'list' ? 'active' : ''}`}
                      onClick={() => setViewMode('list')}
                    >
                      <i className="bi bi-list"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid/List */}
          {products.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-cup-hot display-1 text-muted"></i>
              <h3 className="mt-3">محصولی یافت نشد</h3>
              <p className="text-muted">لطفاً فیلترهای خود را تغییر دهید</p>
            </div>
          ) : (
            <div className={`row ${viewMode === 'list' ? 'products-list' : ''}`}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage; 