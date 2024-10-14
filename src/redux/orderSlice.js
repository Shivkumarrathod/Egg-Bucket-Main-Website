
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../firebase.config';  
import { collection, query, where, getDocs } from 'firebase/firestore';

export const fetchOrdersForCustomer = createAsyncThunk(
  'orders/fetchOrdersForCustomer',
  async (phoneNumber, { rejectWithValue }) => {
    try {
      // Format phone number if it starts with '+'
      const formattedPhoneNumber = phoneNumber.startsWith('+')
        ? phoneNumber.slice(1)
        : phoneNumber;

      console.log("Fetching orders for customerId (phone number):", formattedPhoneNumber);

      const ordersRef = collection(db, 'Order');
      const q = query(ordersRef, where('customerId', '==', formattedPhoneNumber));

      const querySnapshot = await getDocs(q);
      const orders = querySnapshot.docs.map((doc) => {
        const data = doc.data();

        // Convert Firestore timestamps to ISO strings for serialization
        return {
          id: doc.id,
          ...data,
          updatedAt: data.updatedAt ? new Date(data.updatedAt.seconds * 1000).toISOString() : null,
          createdAt: data.createdAt ? new Date(data.createdAt.seconds * 1000).toISOString() : null,
        };
      });

      console.log("Fetched Orders Data:", orders);

      if (orders.length === 0) {
        console.log("No orders found for this customer.");
        return rejectWithValue('No orders found for this customer');
      }

      return orders; 
    } catch (error) {
      console.error('Error fetching orders:', error);
      return rejectWithValue('Failed to fetch orders');
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    ordersData: [], 
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrdersForCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrdersForCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.ordersData = action.payload; 
      })
      .addCase(fetchOrdersForCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; 
      });
  },
});

export default ordersSlice.reducer;


