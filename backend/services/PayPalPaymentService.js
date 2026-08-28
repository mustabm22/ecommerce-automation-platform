const paypal = require('paypal-rest-sdk');
const Transaction = require('../models/Transaction');
const Order = require('../models/Order');
const User = require('../models/User');

paypal.configure({
  mode: process.env.PAYPAL_MODE || 'sandbox',
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET
});

class PayPalPaymentService {
  // إنشاء دفع PayPal
  async createPayment(orderId, customerId, amount, returnUrl, cancelUrl) {
    try {
      const payment = {
        intent: 'sale',
        payer: {
          payment_method: 'paypal'
        },
        redirect_urls: {
          return_url: returnUrl,
          cancel_url: cancelUrl
        },
        transactions: [
          {
            amount: {
              total: amount.toFixed(2),
              currency: 'USD',
              details: {
                subtotal: amount.toFixed(2)
              }
            },
            description: `طلب رقم: ${orderId}`,
            invoice_number: orderId,
            metadata: {
              orderId: orderId,
              customerId: customerId
            }
          }
        ]
      };

      return new Promise((resolve, reject) => {
        paypal.payment.create(payment, (error, payment) => {
          if (error) {
            console.error('❌ خطأ في إنشاء دفع PayPal:', error);
            reject(error);
          } else {
            resolve(payment);
          }
        });
      });
    } catch (error) {
      console.error('❌ خطأ في خدمة PayPal:', error);
      throw error;
    }
  }

  // تنفيذ الدفع
  async executePayment(paymentId, payerId) {
    try {
      return new Promise((resolve, reject) => {
        paypal.payment.execute(paymentId, { payer_id: payerId }, (error, payment) => {
          if (error) {
            console.error('❌ خطأ في تنفيذ الدفع:', error);
            reject(error);
          } else {
            resolve(payment);
          }
        });
      });
    } catch (error) {
      console.error('❌ خطأ في تنفيذ الدفع:', error);
      throw error;
    }
  }

  // معالجة الدفع الناجح
  async handlePaymentSuccess(payment) {
    try {
      const transaction = payment.transactions[0];
      const orderId = transaction.invoice_number;
      const customerId = transaction.metadata.customerId;
      const amount = parseFloat(transaction.amount.total);

      // تحديث حالة الطلب
      await Order.findByIdAndUpdate(
        orderId,
        {
          'payment.status': 'completed',
          'payment.transactionId': payment.id,
          'payment.paidAt': new Date(),
          status: 'confirmed'
        },
        { new: true }
      );

      // إنشاء تسجيل المعاملة
      await Transaction.create({
        transactionId: payment.id,
        user: customerId,
        order: orderId,
        amount: amount,
        type: 'payment',
        method: 'paypal',
        status: 'completed',
        paymentDetails: { paypalTransactionId: payment.id },
        completedAt: new Date()
      });

      console.log('✅ تم معالجة دفع PayPal بنجاح:', payment.id);
      return true;
    } catch (error) {
      console.error('❌ خطأ في معالجة الدفع الناجح:', error);
      throw error;
    }
  }

  // استرجاع الأموال
  async refundPayment(saleId, amount = null) {
    try {
      return new Promise((resolve, reject) => {
        const refundRequest = amount ? { amount: amount.toFixed(2) } : {};

        paypal.sale.find(saleId, (error, sale) => {
          if (error) {
            reject(error);
          } else {
            sale.refund(refundRequest, (error, refund) => {
              if (error) {
                console.error('❌ خطأ في استرجاع الأموال:', error);
                reject(error);
              } else {
                resolve(refund);
              }
            });
          }
        });
      });
    } catch (error) {
      console.error('❌ خطأ في خدمة استرجاع الأموال:', error);
      throw error;
    }
  }
}

module.exports = new PayPalPaymentService();
