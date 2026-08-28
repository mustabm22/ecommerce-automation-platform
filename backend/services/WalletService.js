const Transaction = require('../models/Transaction');
const Order = require('../models/Order');
const User = require('../models/User');

class WalletService {
  // إضافة رصيد إلى المحفظة
  async addBalance(userId, amount, description) {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { $inc: { 'wallet.balance': amount } },
        { new: true }
      );

      // إنشاء معاملة
      const transaction = await Transaction.create({
        transactionId: `WALLET_${Date.now()}_${userId}`,
        user: userId,
        amount: amount,
        type: 'deposit',
        method: 'wallet',
        status: 'completed',
        description: description,
        completedAt: new Date()
      });

      // إضافة المعاملة إلى رصيد المحفظة
      await User.findByIdAndUpdate(
        userId,
        { $push: { 'wallet.transactions': transaction._id } }
      );

      console.log('✅ تمت إضافة رصيد إلى المحفظة:', amount);
      return user;
    } catch (error) {
      console.error('❌ خطأ في إضافة الرصيد:', error);
      throw error;
    }
  }

  // الدفع من المحفظة
  async deductBalance(userId, amount, orderId, description) {
    try {
      const user = await User.findById(userId);

      if (!user || user.wallet.balance < amount) {
        throw new Error('رصيد المحفظة غير كافي');
      }

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $inc: { 'wallet.balance': -amount } },
        { new: true }
      );

      // إنشاء معاملة
      const transaction = await Transaction.create({
        transactionId: `WALLET_PAYMENT_${Date.now()}_${userId}`,
        user: userId,
        order: orderId,
        amount: amount,
        type: 'payment',
        method: 'wallet',
        status: 'completed',
        description: description,
        completedAt: new Date()
      });

      // إضافة المعاملة إلى رصيد المحفظة
      await User.findByIdAndUpdate(
        userId,
        { $push: { 'wallet.transactions': transaction._id } }
      );

      console.log('✅ تم الدفع من المحفظة بنجاح');
      return updatedUser;
    } catch (error) {
      console.error('❌ خطأ في الدفع من المحفظة:', error);
      throw error;
    }
  }

  // الحصول على رصيد المحفظة
  async getBalance(userId) {
    try {
      const user = await User.findById(userId).select('wallet');
      return user ? user.wallet : null;
    } catch (error) {
      console.error('❌ خطأ في الحصول على الرصيد:', error);
      throw error;
    }
  }

  // الحصول على سجل المعاملات
  async getTransactionHistory(userId, limit = 20, page = 1) {
    try {
      const skip = (page - 1) * limit;
      const transactions = await Transaction.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip);

      const total = await Transaction.countDocuments({ user: userId });

      return {
        transactions,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('❌ خطأ في الحصول على سجل المعاملات:', error);
      throw error;
    }
  }

  // استرجاع أموال
  async refundToWallet(userId, amount, orderId, reason) {
    try {
      return await this.addBalance(
        userId,
        amount,
        `استرجاع أموال من الطلب: ${orderId} - ${reason}`
      );
    } catch (error) {
      console.error('❌ خطأ في استرجاع الأموال إلى المحفظة:', error);
      throw error;
    }
  }
}

module.exports = new WalletService();
