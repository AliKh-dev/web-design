import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';

// Get user's cart
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
      await cart.save();
    }
    
    res.json(cart);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ 
      message: 'خطا در دریافت سبد خرید',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    // Validate input
    if (!productId) {
      return res.status(400).json({ message: 'شناسه محصول الزامی است' });
    }
    
    if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'شناسه محصول نامعتبر است' });
    }
    
    if (quantity < 1) {
      return res.status(400).json({ message: 'تعداد باید حداقل 1 باشد' });
    }
    
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'محصول یافت نشد' });
    }
    
    let cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }
    
    // Check if product already in cart
    const existingItemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    
    if (existingItemIndex !== -1) {
      // Update existing item quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity,
        price: product.price
      });
    }
    
    await cart.save();
    await cart.populate('items.product');
    
    res.json({
      message: 'محصول به سبد خرید اضافه شد',
      cart
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ 
      message: 'خطا در افزودن به سبد خرید',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update cart item
export const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    
    if (!itemId || !itemId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'شناسه آیتم نامعتبر است' });
    }
    
    if (quantity < 1) {
      return res.status(400).json({ message: 'تعداد باید حداقل 1 باشد' });
    }
    
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'سبد خرید یافت نشد' });
    }
    
    const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'آیتم در سبد خرید یافت نشد' });
    }
    
    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    await cart.populate('items.product');
    
    res.json({
      message: 'تعداد آیتم به‌روزرسانی شد',
      cart
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({ 
      message: 'خطا در به‌روزرسانی آیتم سبد خرید',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    
    if (!itemId || !itemId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'شناسه آیتم نامعتبر است' });
    }
    
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'سبد خرید یافت نشد' });
    }
    
    const initialLength = cart.items.length;
    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    
    if (cart.items.length === initialLength) {
      return res.status(404).json({ message: 'آیتم در سبد خرید یافت نشد' });
    }
    
    await cart.save();
    await cart.populate('items.product');
    
    res.json({
      message: 'آیتم از سبد خرید حذف شد',
      cart
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ 
      message: 'خطا در حذف آیتم از سبد خرید',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Clear cart
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'سبد خرید یافت نشد' });
    }
    
    cart.items = [];
    await cart.save();
    
    res.json({
      message: 'سبد خرید خالی شد',
      cart
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ 
      message: 'خطا در خالی کردن سبد خرید',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}; 