
const SSLCommerzPayment = require('sslcommerz-lts');

class PaymentService {
    async initiatePayment(order, user) {
        const store_id = process.env.STORE_ID;
        const store_passwd = process.env.STORE_PASS;
        const is_live = false; // true for live, false for testing

        const data = {
            total_amount: order.totalAmount || 100,
            currency: 'BDT',
            tran_id: order.id,
            success_url: `${process.env.ROOT_URL}/api/orders/payment/success/${order.id}`,
            fail_url: `${process.env.ROOT_URL}/api/orders/payment/fail/${order.id}`,
            cancel_url: `${process.env.ROOT_URL}/api/orders/payment/cancel/${order.id}`,
            ipn_url: `${process.env.ROOT_URL}/api/orders/payment/ipn`,
            shipping_method: 'Courier',
            product_name: 'Nexus Hardware Configuration',
            product_category: 'Electronic',
            product_profile: 'general',
            cus_name: user?.name || 'Nexus User',
            cus_email: user?.email || 'customer@nexustech.com',
            cus_add1: order.shippingAddress || 'Dhaka',
            cus_city: 'Dhaka',
            cus_postcode: '1207',
            cus_country: 'Bangladesh',
            cus_phone: '01711111111',
            ship_name: user?.name || 'Nexus User',
            ship_add1: order.shippingAddress || 'Dhaka',
            ship_city: 'Dhaka',
            ship_postcode: '1207',
            ship_country: 'Bangladesh',
        };

        const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
        const apiResponse = await sslcz.init(data);

        if (apiResponse?.GatewayPageURL) {
            return apiResponse.GatewayPageURL;
        } else {
            throw new Error(`Payment gateway error: ${apiResponse?.failedreason || 'Unknown error'}`);
        }
    }
}

module.exports = new PaymentService();