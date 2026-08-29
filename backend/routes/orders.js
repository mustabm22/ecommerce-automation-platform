const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const StripePaymentService = require('../services/StripePaymentService');
const PayPalPaymentService = require('../services/PayPalPaymentService');
const WalletService = require('../services/WalletService');
const AutomationService = require('../services/AutomationService');

// إنشاء طلب جديد
router.post('/create', async (req, res) => {
  try {
    const { customerId, items, shippingAddress, billingAddress, paymentMethod } = req.body;

    // حساب الأسعار
    let subtotal = 0;
    items.forEach(item => {
      subtotal += item.price * item.quantity;
    });

    // حساب الضرائب
    const taxInfo = await AutomationService.calculateTaxes(subtotal, shippingAddress.country);
    const shippingCost = 50; // مثال على تكلفة الشحن
    const total = taxInfo.total + shippingCost;

    // إنشاء الطلب
    const order = new Order({
      orderNumber: `ORD-${Date.now()}`,
      customer: customerId,
      items,
      shippingAddress,
      billingAddress,
      pricing: {
        subtotal,
        tax: taxInfo.tax,
        shippingCost,
        total
      },
      'payment.method': paymentMethod,
      status: 'pending'
    });

    await order.save();

    // توليد الفاتورة تلقائياً
    await AutomationService.generateInvoice(order._id);

    // إرسال تنبيه تأكيد الطلب
    await AutomationService.sendOrderNotification(order._id, 'confirmation');

    res.status(201).json({
      message: '✅ تم إنشاء الطلب بنجاح',
      order
    });
  } catch (error) {
    console.error('❌ خطأ في إنشاء الطلب:', error);
    res.status(500).json({ error: 'خطأ في السيرفر' });
  }
});

// الدفع عبر Stripe
router.post('/payment/stripe', async (req, res) => {
  try {
    const { orderId, customerId, amount } = req.body;

    const paymentIntent = await StripePaymentService.createPaymentIntent(
      amount,
      orderId,
      customerId
    );

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('❌ خطأ في الدفع عبر Stripe:', error);
    res.status(500).json({ error: 'خطأ في الدفع' });
  }
});

// الدفع عبر PayPal
router.post('/payment/paypal', async (req, res) => {
  try {
    const { orderId, customerId, amount, returnUrl, cancelUrl } = req.body;

    const payment = await PayPalPaymentService.createPayment(
      orderId,
      customerId,
      amount,
      returnUrl,
      cancelUrl
    );

    // الحصول على رابط الموافقة
    const approvalUrl = payment.links.find(link => link.rel === 'approval_url');

    res.json({
      paymentId: payment.id,
      approvalUrl: approvalUrl?.href
    });
  } catch (error) {
    console.error('❌ خطأ في الدفع عبر PayPal:', error);
    res.status(500).json({ error: 'خطأ في الدفع' });
  }
});

// الدفع من المحفظة
router.post('/payment/wallet', async (req, res) => {
  try {
    const { orderId, customerId, amount } = req.body;

    await WalletService.deductBalance(
      customerId,
      amount,
      orderId,
      'دفع الطلب من المحفظة'
    );

    // تحديث حالة الطلب
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        'payment.status': 'completed',
        'payment.paidAt': new Date(),
        status: 'confirmed'
      },
      { new: true }
    );

    res.json({
      message: '✅ تم الدفع بنجاح من المحفظة',
      order
    });
  } catch (error) {
    console.error('❌ خطأ في الدفع من المحفظة:', error);
    res.status(500).json({ error: error.message });
  }
});

// الحصول على تفاصيل الطلب
router.get('/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('customer')
      .populate('items.product');

    if (!order) {
      return res.status(404).json({ error: 'الطلب غير موجود' });
    }

    res.json(order);
  } catch (error) {
    console.error('❌ خطأ في الحصول على الطلب:', error);
    res.status(500).json({ error: 'خطأ في السيرفر' });
  }
});

// إلغاء الطلب
router.put('/:orderId/cancel', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status: 'cancelled' },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'الطلب غير موجود' });
    }

    // استرجاع الأموال إلى المحفظة
    if (order.payment.status === 'completed') {
      await WalletService.refundToWallet(
        order.customer,
        order.pricing.total,
        order._id,
        'إلغاء الطلب'
      );
    }

    res.json({
      message: '✅ تم إلغاء الطلب بنجاح',
      order
    });
  } catch (error) {
    console.error('❌ خطأ في إلغاء الطلب:', error);
    res.status(500).json({ error: 'خطأ في السيرفر' });
  }
});

module.exports = router;
