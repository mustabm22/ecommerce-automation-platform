const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult, body } = require('express-validator');

// التحقق من البيانات
const validateRegister = [
  body('firstName').trim().notEmpty().withMessage('الاسم الأول مطلوب'),
  body('lastName').trim().notEmpty().withMessage('الاسم الأخير مطلوب'),
  body('email').isEmail().withMessage('البريد الإلكتروني غير صحيح'),
  body('password').isLength({ min: 6 }).withMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
  body('role').isIn(['customer', 'seller', 'admin']).withMessage('دور غير صحيح')
];

const validateLogin = [
  body('email').isEmail().withMessage('البريد الإلكتروني غير صحيح'),
  body('password').notEmpty().withMessage('كلمة المرور مطلوبة')
];

// التسجيل
router.post('/register', validateRegister, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, password, role } = req.body;

    // التحقق من وجود البريد الإلكتروني
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'البريد الإلكتروني موجود بالفعل' });
    }

    // إنشاء مستخدم جديد
    user = new User({
      firstName,
      lastName,
      email,
      password,
      role
    });

    await user.save();

    // إنشاء JWT Token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: '✅ تم التسجيل بنجاح',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('❌ خطأ في التسجيل:', error);
    res.status(500).json({ error: 'خطأ في السيرفر' });
  }
});

// تسجيل الدخول
router.post('/login', validateLogin, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // البحث عن المستخدم
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'بيانات غير صحيحة' });
    }

    // التحقق من كلمة المرور
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({ error: 'بيانات غير صحيحة' });
    }

    // إنشاء JWT Token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: '✅ تم تسجيل الدخول بنجاح',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('❌ خطأ في تسجيل الدخول:', error);
    res.status(500).json({ error: 'خطأ في السيرفر' });
  }
});

// الحصول على بيانات المستخدم الحالي
router.get('/me', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'يجب توفير token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    res.json({ userId: decoded.userId, role: decoded.role });
  } catch (error) {
    res.status(401).json({ error: 'token غير صحيح' });
  }
});

// تحديث بيانات المستخدم
router.put('/update/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { firstName, lastName, phone, address } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        phone,
        address
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'المستخدم غير موجود' });
    }

    res.json({
      message: '✅ تم تحديث البيانات بنجاح',
      user
    });
  } catch (error) {
    console.error('❌ خطأ في تحديث البيانات:', error);
    res.status(500).json({ error: 'خطأ في السيرفر' });
  }
});

module.exports = router;
