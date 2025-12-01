import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Order } from '@/types';

interface OrdersState {
  newOrders: Order[];
  preparingOrders: Order[];
  deliveredOrders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  newOrders: [],
  preparingOrders: [],
  deliveredOrders: [],
  loading: false,
  error: null,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setNewOrders: (state, action: PayloadAction<Order[]>) => {
      state.newOrders = action.payload;
    },
    setPreparingOrders: (state, action: PayloadAction<Order[]>) => {
      state.preparingOrders = action.payload;
    },
    setDeliveredOrders: (state, action: PayloadAction<Order[]>) => {
      state.deliveredOrders = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addNewOrder: (state, action: PayloadAction<Order>) => {
      // Add new order to the beginning of the list
      state.newOrders.unshift(action.payload);
    },
    updateOrderStatus: (state, action: PayloadAction<{ orderId: number; status: 'preparing' | 'delivered' }>) => {
      // Move order based on status
      const orderIndex = state.newOrders.findIndex(o => o.id === action.payload.orderId);
      if (orderIndex !== -1) {
        const order = state.newOrders[orderIndex];
        order.status = action.payload.status;
        if (action.payload.status === 'preparing') {
          state.preparingOrders.push(order);
        } else if (action.payload.status === 'delivered') {
          state.deliveredOrders.push(order);
        }
        state.newOrders.splice(orderIndex, 1);
      }
    },
    clearOrders: (state) => {
      state.newOrders = [];
      state.preparingOrders = [];
      state.deliveredOrders = [];
      state.error = null;
    },
  },
});

export const {
  setNewOrders,
  setPreparingOrders,
  setDeliveredOrders,
  setLoading,
  setError,
  addNewOrder,
  updateOrderStatus,
  clearOrders,
} = ordersSlice.actions;

export default ordersSlice.reducer;
