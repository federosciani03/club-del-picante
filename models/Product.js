const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: String,
  size: String,
  weight: String,
  price: Number,
  stock: { type: Number, default: 0 },
  spiceLevel: Number,
  description: String,
  image: String,
  badge: String,
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
