const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['deposit', 'payment', 'refund', 'withdrawal'],
    required: true
  },
  method: {
    type: String,
    enum: ['stripe', 'paypal', 'wallet', 'bank_transfer'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  paymentDetails: {
    stripePaymentId: String,
    paypalTransactionId: String,
    bankTransferId: String
  },
  metadata: mongoose.Schema.Types.Mixed,
  description: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
