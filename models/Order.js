const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  id: String,
  name: String,
  size: String,
  weight: String,
  price: Number,
  quantity: Number,
  image: String
});

const orderSchema = new mongoose.Schema({
  customer: {
    name: String,
    email: String,
    phone: String
  },
  items: [orderItemSchema],
  shipping: mongoose.Schema.Types.Mixed,
  total: Number,
  deliveryType: { type: String, enum: ['envio', 'retiro'], default: 'envio' },
  status: {
    type: String,
    enum: ['pendiente_pago', 'pago_pendiente', 'confirmado', 'en_preparacion', 'enviado', 'entregado', 'pago_rechazado', 'cancelado'],
    default: 'pendiente_pago'
  },
  paymentId: String,
  paymentStatus: String,
  adminNotes: String
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
