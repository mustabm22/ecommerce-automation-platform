const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// الأمان
app.use(helmet());
app.use(cors());

// المفسرات
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// الاتصال بقاعدة البيانات
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ تم الاتصال بقاعدة البيانات'))
  .catch(err => console.error('❌ خطأ في الاتصال:', err));

// المسارات
app.get('/', (req, res) => {
  res.json({ 
    message: '🛍️ مرحباً بك في منصة التجارة الإلكترونية',
    version: '1.0.0',
    status: 'running'
  });
});

// الخطأ 404
app.use((req, res) => {
  res.status(404).json({ error: 'المسار غير موجود' });
});

// معالجة الأخطاء
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'حدث خطأ في السيرفر' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 السيرفر يعمل على المنفذ ${PORT}`);
});
