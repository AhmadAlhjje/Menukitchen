import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Order } from '@/types';

interface OrdersState {
  newOrders: Order[];
  readyOrders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  newOrders: [],
  readyOrders: [],
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
    setReadyOrders: (state, action: PayloadAction<Order[]>) => {
      state.readyOrders = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateOrderStatus: (state, action: PayloadAction<{ orderId: number; status: 'ready' }>) => {
      // Move order from new to ready
      const orderIndex = state.newOrders.findIndex(o => o.id === action.payload.orderId);
      if (orderIndex !== -1) {
        const order = state.newOrders[orderIndex];
        order.status = action.payload.status;
        state.readyOrders.push(order);
        state.newOrders.splice(orderIndex, 1);
      }
    },
    clearOrders: (state) => {
      state.newOrders = [];
      state.readyOrders = [];
      state.error = null;
    },
  },
});

export const {
  setNewOrders,
  setReadyOrders,
  setLoading,
  setError,
  updateOrderStatus,
  clearOrders,
} = ordersSlice.actions;

export default ordersSlice.reducer;
