const ShopifyIntegration = require('./ShopifyIntegration');
const WooCommerceIntegration = require('./WooCommerceIntegration');
const OpencartIntegration = require('./OpencartIntegration');

class IntegrationManager {
  // مزامنة جميع المنتجات من جميع المنصات
  async syncAllProducts() {
    try {
      console.log('⏳ جاري مزامنة جميع المنتجات من جميع المنصات...');

      const results = {};

      // مزامنة من Shopify
      try {
        results.shopify = await ShopifyIntegration.syncProductsFromShopify();
        console.log('✅ Shopify:', results.shopify);
      } catch (error) {
        console.error('❌ خطأ في Shopify:', error.message);
        results.shopify = { error: error.message };
      }

      // مزامنة من WooCommerce
      try {
        results.woocommerce = await WooCommerceIntegration.syncProductsFromWooCommerce();
        console.log('✅ WooCommerce:', results.woocommerce);
      } catch (error) {
        console.error('❌ خطأ في WooCommerce:', error.message);
        results.woocommerce = { error: error.message };
      }

      // مزامنة من Opencart
      try {
        results.opencart = await OpencartIntegration.syncProductsFromOpencart();
        console.log('✅ Opencart:', results.opencart);
      } catch (error) {
        console.error('❌ خطأ في Opencart:', error.message);
        results.opencart = { error: error.message };
      }

      return results;
    } catch (error) {
      console.error('❌ خطأ في مزامنة المنتجات:', error);
      throw error;
    }
  }

  // مزامنة جميع الطلبات من جميع المنصات
  async syncAllOrders() {
    try {
      console.log('⏳ جاري مزامنة جميع الطلبات من جميع المنصات...');

      const results = {};

      // مزامنة من Shopify
      try {
        results.shopify = await ShopifyIntegration.syncOrdersFromShopify();
        console.log('✅ Shopify:', results.shopify);
      } catch (error) {
        console.error('❌ خطأ في Shopify:', error.message);
        results.shopify = { error: error.message };
      }

      // مزامنة من WooCommerce
      try {
        results.woocommerce = await WooCommerceIntegration.syncOrdersFromWooCommerce();
        console.log('✅ WooCommerce:', results.woocommerce);
      } catch (error) {
        console.error('❌ خطأ في WooCommerce:', error.message);
        results.woocommerce = { error: error.message };
      }

      // مزامنة من Opencart
      try {
        results.opencart = await OpencartIntegration.syncOrdersFromOpencart();
        console.log('✅ Opencart:', results.opencart);
      } catch (error) {
        console.error('❌ خطأ في Opencart:', error.message);
        results.opencart = { error: error.message };
      }

      return results;
    } catch (error) {
      console.error('❌ خطأ في مزامنة الطلبات:', error);
      throw error;
    }
  }

  // اختبار جميع الاتصالات
  async testAllConnections() {
    try {
      console.log('⏳ جاري اختبار الاتصالات...');

      const results = {};

      try {
        results.shopify = await ShopifyIntegration.testConnection();
        console.log('✅ Shopify متصل');
      } catch (error) {
        console.error('❌ Shopify غير متصل:', error.message);
        results.shopify = { error: error.message };
      }

      try {
        results.woocommerce = await WooCommerceIntegration.testConnection();
        console.log('✅ WooCommerce متصل');
      } catch (error) {
        console.error('❌ WooCommerce غير متصل:', error.message);
        results.woocommerce = { error: error.message };
      }

      try {
        results.opencart = await OpencartIntegration.testConnection();
        console.log('✅ Opencart متصل');
      } catch (error) {
        console.error('❌ Opencart غير متصل:', error.message);
        results.opencart = { error: error.message };
      }

      return results;
    } catch (error) {
      console.error('❌ خطأ في اختبار الاتصالات:', error);
      throw error;
    }
  }
}

module.exports = new IntegrationManager();
