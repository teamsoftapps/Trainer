import axiosBaseURL from "./AxiosBaseURL";

export const TrainerBookingAPI = {
    getMyBookings: async (token) => {
        const res = await axiosBaseURL.get("/booking/my-bookings", {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    },

    updateStatus: async (token, bookingId, status) => {
        const res = await axiosBaseURL.patch(
            `/booking/${bookingId}/status`,
            { status },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return res.data;
    },
    trainerComplete: async (token, bookingId) => {
        const res = await axiosBaseURL.patch(
            `/booking/${bookingId}/trainer-complete`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return res.data;
    },
    reschedule: async (token, bookingId, payload) => {
        const res = await axiosBaseURL.patch(
            `/booking/${bookingId}/reschedule`,
            payload,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return res.data;
    },
};