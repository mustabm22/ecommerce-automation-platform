const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    sparse: true
  },
  description: String,
  logo: String,
  banner: String,
  contact: {
    email: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    country: String,
    postalCode: String
  },
  socialLinks: {
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  policies: {
    returnPolicy: String,
    shippingPolicy: String,
    privacyPolicy: String
  },
  integrations: {
    shopify: {
      connected: Boolean,
      apiKey: { type: String, select: false },
      apiPassword: { type: String, select: false },
      storeName: String
    },
    woocommerce: {
      connected: Boolean,
      storeUrl: String,
      consumerKey: { type: String, select: false },
      consumerSecret: { type: String, select: false }
    },
    opencart: {
      connected: Boolean,
      storeUrl: String,
      apiToken: { type: String, select: false }
    }
  },
  statistics: {
    totalProducts: Number,
    totalOrders: Number,
    totalRevenue: Number,
    activeListings: Number
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Store', storeSchema);
