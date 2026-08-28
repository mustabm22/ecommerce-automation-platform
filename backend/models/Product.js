const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  price: {
    original: {
      type: Number,
      required: true
    },
    sale: {
      type: Number,
      default: null
    },
    discount: {
      type: Number,
      default: 0
    }
  },
  images: [{
    url: String,
    altText: String
  }],
  inventory: {
    quantity: {
      type: Number,
      required: true,
      default: 0
    },
    sku: {
      type: String,
      unique: true,
      sparse: true
    },
    trackInventory: {
      type: Boolean,
      default: true
    }
  },
  specifications: [
    {
      key: String,
      value: String
    }
  ],
  rating: {
    average: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'archived'],
    default: 'active'
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'draft'],
    default: 'public'
  },
  tags: [String],
  seo: {
    metaTitle: String,
    metaDescription: String,
    slug: {
      type: String,
      unique: true,
      sparse: true
    }
  },
  platforms: {
    shopify: {
      synced: Boolean,
      productId: String,
      variantId: String
    },
    woocommerce: {
      synced: Boolean,
      productId: String
    },
    opencart: {
      synced: Boolean,
      productId: String
    }
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

module.exports = mongoose.model('Product', productSchema);
