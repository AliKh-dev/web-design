import Product from '../models/product.model.js';

/*
  GET /api/products?search=ترک
  GET /api/products?minPrice=250&maxPrice=300
  GET /api/products?page=2&limit=5
*/
export async function getAllProducts(req, res) {
  try {
    const { search, minPrice, maxPrice, category, page = 1, limit = 10 } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
      ];
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    const skip = (page - 1) * limit;

    const products = await Product.find(query).skip(skip).limit(Number(limit));
    const total = await Product.countDocuments(query);

    res.json({
      total,
      page: Number(page),
      pageSize: products.length,
      products,
    });
  } catch (err) {
    console.error('Get all products error:', err);
    res.status(500).json({ 
      message: 'خطا در دریافت محصولات',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}

export async function createProduct(req, res) {
  try {
    const { name, price, description, category, weight, imageUrl } = req.body;
    
    // Validate required fields
    if (!name || !price || !description) {
      return res.status(400).json({ 
        message: 'نام، قیمت و توضیحات محصول الزامی است' 
      });
    }

    // Validate price
    if (isNaN(price) || Number(price) < 0) {
      return res.status(400).json({ 
        message: 'قیمت باید عدد مثبت باشد' 
      });
    }
    
    const newProduct = await Product.create({ 
      name, 
      price: Number(price), 
      description, 
      category: category || 'general',
      weight: weight || 'N/A',
      imageUrl: imageUrl || '/images/default-coffee.jpg'
    });
    
    res.status(201).json({
      message: 'محصول با موفقیت ایجاد شد',
      product: newProduct
    });
  } catch (err) {
    console.error('Create product error:', err);
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ 
        message: 'داده‌های نامعتبر',
        errors 
      });
    }
    res.status(500).json({ 
      message: 'خطا در ایجاد محصول',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}

export async function getProductById(req, res) {
  try {
    const { id } = req.params;
    
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'شناسه محصول نامعتبر است' });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'محصول یافت نشد' });
    }
    
    res.json(product);
  } catch (err) {
    console.error('Get product by ID error:', err);
    res.status(500).json({ 
      message: 'خطا در دریافت محصول',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}

export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'شناسه محصول نامعتبر است' });
    }

    // Validate price if provided
    if (updateData.price && (isNaN(updateData.price) || Number(updateData.price) < 0)) {
      return res.status(400).json({ message: 'قیمت باید عدد مثبت باشد' });
    }

    const product = await Product.findByIdAndUpdate(id, updateData, { 
      new: true,
      runValidators: true 
    });
    
    if (!product) {
      return res.status(404).json({ message: 'محصول یافت نشد' });
    }
    
    res.json({
      message: 'محصول با موفقیت به‌روزرسانی شد',
      product
    });
  } catch (err) {
    console.error('Update product error:', err);
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ 
        message: 'داده‌های نامعتبر',
        errors 
      });
    }
    res.status(500).json({ 
      message: 'خطا در به‌روزرسانی محصول',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}

export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;

    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'شناسه محصول نامعتبر است' });
    }

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: 'محصول یافت نشد' });
    }
    
    res.json({ 
      message: 'محصول با موفقیت حذف شد',
      deletedProduct: product
    });
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({ 
      message: 'خطا در حذف محصول',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}
