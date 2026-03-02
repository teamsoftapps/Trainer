import axiosBaseURL from "./AxiosBaseURL"; // your existing axios instance

export const BookingAPI = {
    // ✅ create booking draft
    createDraft: async (token, payload) => {
        const res = await axiosBaseURL.post("/booking", payload, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data; // { success, data:{ bookingId, amount, ... } }
    },

    // ✅ get booked times for a date
    getBookedTimes: async (trainerId, date) => {
        const res = await axiosBaseURL.get(
            `/booking/trainer/${trainerId}/booked-times?date=${date}`,
        );
        return res.data; // { success, data:[ "10:00 AM", ... ] }
    },

    // ✅ create stripe payment intent linked to booking
    createStripeIntent: async (token, bookingId) => {
        const res = await axiosBaseURL.post(
            `/booking/${bookingId}/pay/stripe-intent`,
            {},
            { headers: { Authorization: `Bearer ${token}` } },
        );
        return res.data; // { success, data:{ paymentIntent, ephemeralKey, customer, publishableKey } }
    },

    // ✅ get booking details/status
    getBooking: async (token, bookingId) => {
        const res = await axiosBaseURL.get(`/booking/${bookingId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    },

    cancelBooking: async (token, bookingId, reason) => {
        const res = await axiosBaseURL.post(
            `/booking/${bookingId}/cancel`,
            { reason },
            { headers: { Authorization: `Bearer ${token}` } },
        );
        return res.data;
    },

    createConversation: async (userId, trainerId) => {
        const res = await axiosBaseURL.post('/chat/create-conversation', {
            userId,
            trainerId,
        });
        return res.data;
    },

    getMyBookings: async (token) => {
        const res = await axiosBaseURL.get("/booking/my-bookings", {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    },
};