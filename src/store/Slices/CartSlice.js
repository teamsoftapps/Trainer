import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
    totalAmount: 0,
    totalQuantity: 0,
};

const CartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart(state, action) {
            const newItem = action.payload;
            const existingItem = state.items.find((item) => item._id === newItem._id);
            state.totalQuantity++;
            if (!existingItem) {
                state.items.push({
                    ...newItem,
                    quantity: 1,
                    totalPrice: newItem.price,
                });
            } else {
                existingItem.quantity++;
                existingItem.totalPrice = existingItem.totalPrice + newItem.price;
            }
            state.totalAmount = state.items.reduce(
                (total, item) => total + item.totalPrice,
                0
            );
        },
        removeFromCart(state, action) {
            const id = action.payload;
            const existingItem = state.items.find((item) => item._id === id);
            state.totalQuantity--;
            if (existingItem.quantity === 1) {
                state.items = state.items.filter((item) => item._id !== id);
            } else {
                existingItem.quantity--;
                existingItem.totalPrice = existingItem.totalPrice - existingItem.price;
            }
            state.totalAmount = state.items.reduce(
                (total, item) => total + item.totalPrice,
                0
            );
        },
        clearCart(state) {
            state.items = [];
            state.totalQuantity = 0;
            state.totalAmount = 0;
        },
        removeItemCompletely(state, action) {
            const id = action.payload;
            const existingItem = state.items.find((item) => item._id === id);
            if (existingItem) {
                state.totalQuantity = state.totalQuantity - existingItem.quantity;
                state.items = state.items.filter((item) => item._id !== id);
                state.totalAmount = state.items.reduce(
                    (total, item) => total + item.totalPrice,
                    0
                );
            }
        }
    },
});

export const { addToCart, removeFromCart, clearCart, removeItemCompletely } = CartSlice.actions;

export default CartSlice.reducer;
