const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [{ product: productId, quantity }] });
  } else {
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }
  }
  await cart.save();
  res.json(cart);
};

exports.updateCart = async (req, res) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  const itemIndex = cart.items.findIndex(item => item.product.toString() === req.params.id);
  if (itemIndex > -1) {
    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    res.json(cart);
  } else {
    res.status(404).json({ message: 'Item not found in cart' });
  }
};

exports.deleteFromCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  cart.items = cart.items.filter(item => item.product.toString() !== req.params.id);
  await cart.save();
  res.json(cart);
};
