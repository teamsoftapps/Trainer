import axiosBaseURL from './AxiosBaseURL';

export const ShopAPI = {
  // ✅ create stripe payment intent for cart order
  createStripeIntent: async (token, payload) => {
    const res = await axiosBaseURL.post(`/shop/pay/stripe-intent`, payload, {
      headers: {Authorization: `Bearer ${token}`},
    });
    return res.data; // { success, data:{ paymentIntent, ephemeralKey, customer, publishableKey, orderId } }
  },

  // ✅ fetch my orders
  getMyOrders: async token => {
    const res = await axiosBaseURL.get(`/shop/my-orders`, {
      headers: {Authorization: `Bearer ${token}`},
    });
    return res.data; // { success, data: [] }
  },

  // ✅ verify order status (optional but good for polling)
  getOrderStatus: async (token, orderId) => {
    const res = await axiosBaseURL.get(`/Shop/order/${orderId}`, {
      headers: {Authorization: `Bearer ${token}`},
    });
    return res.data;
  },

  // ✅ pay for an existing unpaid order
  payForOrder: async (token, orderId) => {
    const res = await axiosBaseURL.post(
      `/shop/pay-order/${orderId}`,
      {},
      {headers: {Authorization: `Bearer ${token}`}},
    );
    return res.data;
  },

  // ✅ cancel order
  cancelOrder: async (token, orderId) => {
    const res = await axiosBaseURL.patch(
      `/shop/${orderId}/status`,
      {status: 'cancelled'},
      {headers: {Authorization: `Bearer ${token}`}},
    );
    return res.data;
  },
};
