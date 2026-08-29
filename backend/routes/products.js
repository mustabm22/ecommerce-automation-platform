const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { body, validationResult } = require('express-validator');

// الحصول على جميع المنتجات
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, category, search } = req.query;
    const skip = (page - 1) * limit;

    let query = { status: 'active', visibility: 'public' };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('category')
      .populate('seller', 'firstName lastName avatar');

    const total = await Product.countDocuments(query);

    res.json({
      products,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('❌ خطأ في جلب المنتجات:', error);
    res.status(500).json({ error: 'خطأ في السيرفر' });
  }
});

// الحصول على منتج واحد
router.get('/:productId', async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId)
      .populate('category')
      .populate('seller', 'firstName lastName avatar email phone')
      .populate('reviews');

    if (!product) {
      return res.status(404).json({ error: 'المنتج غير موجود' });
    }

    res.json(product);
  } catch (error) {
    console.error('❌ خطأ في جلب المنتج:', error);
    res.status(500).json({ error: 'خطأ في السيرفر' });
  }
});

// إنشاء منتج جديد
const validateProduct = [
  body('name').trim().notEmpty().withMessage('اسم المنتج مطلوب'),
  body('description').trim().notEmpty().withMessage('وصف المنتج مطلوب'),
  body('category').notEmpty().withMessage('الفئة مطلوبة'),
  body('price.original').isFloat({ min: 0 }).withMessage('السعر يجب أن يكون رقم موجب'),
  body('inventory.quantity').isInt({ min: 0 }).withMessage('الكمية يجب أن تكون رقم موجب')
];

router.post('/', validateProduct, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, category, seller, price, inventory, images } = req.body;

    const product = new Product({
      name,
      description,
      category,
      seller,
      price,
      inventory,
      images,
      status: 'active'
    });

    await product.save();

    res.status(201).json({
      message: '✅ تم إنشاء المنتج بنجاح',
      product
    });
  } catch (error) {
    console.error('❌ خطأ في إنشاء المنتج:', error);
    res.status(500).json({ error: 'خطأ في السيرفر' });
  }
});

// تحديث المنتج
router.put('/:productId', async (req, res) => {
  try {
    const { name, description, price, inventory, status } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.productId,
      {
        name,
        description,
        price,
        inventory,
        status,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ error: 'المنتج غير موجود' });
    }

    res.json({
      message: '✅ تم تحديث المنتج بنجاح',
      product
    });
  } catch (error) {
    console.error('❌ خطأ في تحديث المنتج:', error);
    res.status(500).json({ error: 'خطأ في السيرفر' });
  }
});

// حذف المنتج
router.delete('/:productId', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.productId,
      { status: 'archived' },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ error: 'المنتج غير موجود' });
    }

    res.json({
      message: '✅ تم حذف المنتج بنجاح',
      product
    });
  } catch (error) {
    console.error('❌ خطأ في حذف المنتج:', error);
    res.status(500).json({ error: 'خطأ في السيرفر' });
  }
});

module.exports = router;
