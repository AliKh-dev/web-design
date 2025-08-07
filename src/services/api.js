// API Configuration
// Use REACT_APP_API_URL from .env if available, otherwise default to backend at http://localhost:3001/api
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Helper function to set auth token
const setAuthToken = (token) => {
  localStorage.setItem('authToken', token);
};

// Helper function to remove auth token
const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

// Helper function to get headers
const getHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// API request helper
const apiRequest = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('Making API request to:', url);
    console.log('Request options:', options);
    
    const response = await fetch(url, {
      ...options,
      headers: getHeaders(),
    });

    console.log('API Response status:', response.status);
    console.log('API Response headers:', response.headers);
    console.log('API Response ok:', response.ok);

    if (!response.ok) {
      console.error('API Response not ok:', response.status, response.statusText);
      
      // Handle different error status codes
      if (response.status === 401) {
        // Token expired or invalid
        removeAuthToken();
        window.location.href = '/';
        throw new Error('احراز هویت ناموفق بود. لطفاً دوباره وارد شوید.');
      }
      
      if (response.status === 403) {
        throw new Error('دسترسی محدود. شما مجوز انجام این عملیات را ندارید.');
      }
      
      if (response.status === 404) {
        throw new Error('منبع مورد نظر یافت نشد.');
      }
      
      if (response.status === 422) {
        throw new Error('داده‌های ارسالی نامعتبر است.');
      }
      
      if (response.status >= 500) {
        throw new Error('خطای سرور. لطفاً بعداً تلاش کنید.');
      }
      
      // Try to get error message from response
      try {
        const errorData = await response.json();
        throw new Error(errorData.message || `خطای ${response.status}: ${response.statusText}`);
      } catch (parseError) {
        throw new Error(`خطای ${response.status}: ${response.statusText}`);
      }
    }

    const data = await response.json();
    console.log('API Response data:', data);
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    console.error('Error details:', error.message);
    throw error;
  }
};

// Auth API
export const authAPI = {
  // Login
  login: async (credentials) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.token) {
      setAuthToken(response.token);
    }
    
    return response;
  },

  // Register
  register: async (userData) => {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.token) {
      setAuthToken(response.token);
    }
    
    return response;
  },

  // Logout
  logout: () => {
    removeAuthToken();
    window.location.href = '/';
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      return await apiRequest('/auth/me');
    } catch (error) {
      // Fallback to localStorage if API fails
      const userData = localStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!getAuthToken();
  }
};

// Products API
export const productsAPI = {
  // Get all products
  getAllProducts: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/products?${queryString}` : '/products';
    return await apiRequest(endpoint);
  },

  // Get products by search
  searchProducts: async (searchTerm) => {
    return await apiRequest(`/products?search=${encodeURIComponent(searchTerm)}`);
  },

  // Get products by price range
  getProductsByPriceRange: async (minPrice, maxPrice) => {
    const params = {};
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    return await apiRequest(`/products?${new URLSearchParams(params).toString()}`);
  },

  // Get single product
  getProduct: async (id) => {
    return await apiRequest(`/products/${id}`);
  },

  // Create product
  createProduct: async (productData) => {
    return await apiRequest('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  // Update product
  updateProduct: async (id, productData) => {
    return await apiRequest(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  // Delete product
  deleteProduct: async (id) => {
    return await apiRequest(`/products/${id}`, {
      method: 'DELETE',
    });
  }
};

// Cart API
export const cartAPI = {
  // Get user's cart
  getCart: async () => {
    return await apiRequest('/cart');
  },

  // Add item to cart
  addToCart: async (productId, quantity = 1) => {
    return await apiRequest('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  },

  // Update cart item
  updateCartItem: async (itemId, quantity) => {
    return await apiRequest(`/cart/item/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  },

  // Remove item from cart
  removeFromCart: async (itemId) => {
    return await apiRequest(`/cart/item/${itemId}`, {
      method: 'DELETE',
    });
  },

  // Clear cart
  clearCart: async () => {
    return await apiRequest('/cart/clear', {
      method: 'DELETE',
    });
  }
}; 