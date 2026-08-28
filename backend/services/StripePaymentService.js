const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Transaction = require('../models/Transaction');
const Order = require('../models/Order');
const User = require('../models/User');

class StripePaymentService {
  // إنشاء نية دفع
  async createPaymentIntent(amount, orderId, customerId) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // تحويل إلى فلس
        currency: 'usd',
        metadata: {
          orderId: orderId,
          customerId: customerId
        },
        receipt_email: null
      });

      return paymentIntent;
    } catch (error) {
      console.error('❌ خطأ في Stripe:', error);
      throw error;
    }
  }

  // معالجة webhook من Stripe
  async handleWebhook(event) {
    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSuccess(event.data.object);
          break;
        case 'payment_intent.payment_failed':
          await this.handlePaymentFailed(event.data.object);
          break;
        case 'charge.refunded':
          await this.handleRefund(event.data.object);
          break;
        default:
          console.log(`نوع حدث غير معالج: ${event.type}`);
      }
    } catch (error) {
      console.error('❌ خطأ في معالجة webhook:', error);
      throw error;
    }
  }

  // معالجة الدفع الناجح
  async handlePaymentSuccess(paymentIntent) {
    try {
      const { orderId, customerId } = paymentIntent.metadata;

      // تحديث حالة الطلب
      const order = await Order.findByIdAndUpdate(
        orderId,
        {
          'payment.status': 'completed',
          'payment.transactionId': paymentIntent.id,
          'payment.paidAt': new Date(),
          status: 'confirmed'
        },
        { new: true }
      );

      // إنشاء تسجيل المعاملة
      await Transaction.create({
        transactionId: paymentIntent.id,
        user: customerId,
        order: orderId,
        amount: paymentIntent.amount / 100,
        type: 'payment',
        method: 'stripe',
        status: 'completed',
        paymentDetails: { stripePaymentId: paymentIntent.id },
        completedAt: new Date()
      });

      console.log('✅ تم معالجة الدفع بنجاح:', paymentIntent.id);
      return order;
    } catch (error) {
      console.error('❌ خطأ في معالجة الدفع الناجح:', error);
      throw error;
    }
  }

  // معالجة فشل الدفع
  async handlePaymentFailed(paymentIntent) {
    try {
      const { orderId, customerId } = paymentIntent.metadata;

      await Order.findByIdAndUpdate(
        orderId,
        {
          'payment.status': 'failed',
          status: 'pending'
        },
        { new: true }
      );

      await Transaction.create({
        transactionId: paymentIntent.id,
        user: customerId,
        order: orderId,
        amount: paymentIntent.amount / 100,
        type: 'payment',
        method: 'stripe',
        status: 'failed'
      });

      console.log('❌ فشل الدفع:', paymentIntent.id);
    } catch (error) {
      console.error('❌ خطأ في معالجة فشل الدفع:', error);
      throw error;
    }
  }

  // معالجة استرجاع الأموال
  async handleRefund(charge) {
    try {
      const transaction = await Transaction.findOne({
        'paymentDetails.stripePaymentId': charge.payment_intent
      });

      if (transaction) {
        transaction.status = 'refunded';
        await transaction.save();

        // تحديث رصيد المحفظة
        await User.findByIdAndUpdate(
          transaction.user,
          { $inc: { 'wallet.balance': charge.amount / 100 } },
          { new: true }
        );

        console.log('✅ تم معالجة استرجاع الأموال:', charge.id);
      }
    } catch (error) {
      console.error('❌ خطأ في معالجة استرجاع الأموال:', error);
      throw error;
    }
  }

  // استرجاع الأموال
  async refundPayment(paymentIntentId, amount = null) {
    try {
      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : null
      });

      return refund;
    } catch (error) {
      console.error('❌ خطأ في استرجاع الأموال:', error);
      throw error;
    }
  }
}

module.exports = new StripePaymentService();
