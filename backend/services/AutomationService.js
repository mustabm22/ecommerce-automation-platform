const Order = require('../models/Order');
const User = require('../models/User');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

class AutomationService {
  // توليد فاتورة تلقائياً
  async generateInvoice(orderId) {
    try {
      const order = await Order.findById(orderId)
        .populate('customer')
        .populate('items.product');

      if (!order) throw new Error('الطلب غير موجود');

      const invoiceNumber = `INV-${Date.now()}-${orderId.slice(-6)}`;
      const invoiceUrl = `${process.env.APP_URL}/invoices/${invoiceNumber}.pdf`;

      // تحديث الطلب بمعلومات الفاتورة
      await Order.findByIdAndUpdate(
        orderId,
        {
          'invoice.number': invoiceNumber,
          'invoice.url': invoiceUrl,
          'invoice.generatedAt': new Date()
        },
        { new: true }
      );

      console.log('✅ تم توليد فاتورة:', invoiceNumber);
      return invoiceNumber;
    } catch (error) {
      console.error('❌ خطأ في توليد الفاتورة:', error);
      throw error;
    }
  }

  // إرسال تنبيهات البريد الإلكتروني
  async sendOrderNotification(orderId, type = 'confirmation') {
    try {
      const order = await Order.findById(orderId).populate('customer');
      if (!order) throw new Error('الطلب غير موجود');

      const emailTemplates = {
        confirmation: {
          subject: 'تأكيد الطلب',
          html: `
            <h2>شكراً لطلبك!</h2>
            <p>رقم الطلب: ${order.orderNumber}</p>
            <p>الحالة: ${order.status}</p>
            <p>الإجمالي: ${order.pricing.total} درهم</p>
          `
        },
        shipped: {
          subject: 'تم شحن الطلب',
          html: `
            <h2>تم شحن طلبك</h2>
            <p>رقم الطلب: ${order.orderNumber}</p>
            <p>رقم التتبع: ${order.shipping.trackingNumber}</p>
            <p>الناقل: ${order.shipping.carrier}</p>
          `
        },
        delivered: {
          subject: 'تم توصيل الطلب',
          html: `
            <h2>تم توصيل الطلب بنجاح</h2>
            <p>رقم الطلب: ${order.orderNumber}</p>
            <p>تاريخ التوصيل: ${new Date(order.shipping.deliveredAt).toLocaleDateString('ar-AE')}</p>
          `
        }
      };

      const template = emailTemplates[type];
      if (!template) throw new Error('نوع البريد غير معروف');

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: order.customer.email,
        subject: template.subject,
        html: template.html
      });

      console.log(`✅ تم إرسال بريد ${type} إلى ${order.customer.email}`);
    } catch (error) {
      console.error('❌ خطأ في إرسال البريد:', error);
      throw error;
    }
  }

  // حساب الضرائب تلقائياً
  async calculateTaxes(amount, country = 'AE') {
    try {
      const taxRates = {
        'AE': 0.05, // 5% في الإمارات
        'SA': 0.15, // 15% في السعودية
        'KW': 0.00, // بدون ضرائب في الكويت
        'default': 0.10 // 10% افتراضي
      };

      const taxRate = taxRates[country] || taxRates['default'];
      const tax = amount * taxRate;

      return {
        taxRate,
        tax,
        total: amount + tax
      };
    } catch (error) {
      console.error('❌ خطأ في حساب الضرائب:', error);
      throw error;
    }
  }

  // جدولة الشحنات تلقائياً
  async scheduleShipment(orderId, shippingDate) {
    try {
      const order = await Order.findByIdAndUpdate(
        orderId,
        {
          'shipping.status': 'scheduled',
          'shipping.estimatedDelivery': shippingDate
        },
        { new: true }
      );

      console.log('✅ تم جدولة الشحنة:', orderId);
      return order;
    } catch (error) {
      console.error('❌ خطأ في جدولة الشحنة:', error);
      throw error;
    }
  }

  // إنشاء تقرير يومي
  async generateDailyReport(startDate, endDate) {
    try {
      const orders = await Order.find({
        createdAt: {
          $gte: startDate,
          $lte: endDate
        },
        'payment.status': 'completed'
      });

      const report = {
        date: new Date(),
        totalOrders: orders.length,
        totalRevenue: orders.reduce((sum, order) => sum + order.pricing.total, 0),
        averageOrderValue: 0,
        topProducts: [],
        ordersByStatus: {}
      };

      report.averageOrderValue = report.totalRevenue / orders.length || 0;

      console.log('✅ تم إنشاء التقرير اليومي');
      return report;
    } catch (error) {
      console.error('❌ خطأ في إنشاء التقرير:', error);
      throw error;
    }
  }

  // مراقبة المخزون
  async monitorInventory(productId, threshold = 10) {
    try {
      const Product = require('../models/Product');
      const product = await Product.findById(productId);

      if (!product) throw new Error('المنتج غير موجود');

      if (product.inventory.quantity <= threshold) {
        // إرسال تنبيه للبائع
        console.log(`⚠️ تنبيه: المخزون منخفض للمنتج: ${product.name}`);
        return { alert: true, quantity: product.inventory.quantity };
      }

      return { alert: false, quantity: product.inventory.quantity };
    } catch (error) {
      console.error('❌ خطأ في مراقبة المخزون:', error);
      throw error;
    }
  }
}

module.exports = new AutomationService();
