import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../firebase.config';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';

// Async thunk to fetch orders for a customer
// Async thunk to fetch orders for a customer
export const fetchOrdersForCustomer = createAsyncThunk(
  'orders/fetchOrdersForCustomer',
  async (phoneNumber, { rejectWithValue }) => {
    try {
      const formattedPhoneNumber = phoneNumber.startsWith('+')
        ? phoneNumber.slice(1)
        : phoneNumber;

      console.log("Fetching orders for customerId (phone number):", formattedPhoneNumber);

      const ordersRef = collection(db, 'Order');
      const q = query(ordersRef, where('customerId', '==', formattedPhoneNumber));

      const querySnapshot = await getDocs(q);

      const orders = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          updatedAt: data.updatedAt ? new Date(data.updatedAt.seconds * 1000).toISOString() : null,
          createdAt: data.createdAt ? new Date(data.createdAt.seconds * 1000).toISOString() : null,
          address: data.address || {}, // Ensure address is included correctly
        };
      });

      console.log("Fetched Orders Data:", orders); // Log orders here

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


// Async thunk to add a new order
export const addOrder = createAsyncThunk(
  'orders/addOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      // Add the new order to Firestore
      const ordersRef = collection(db, 'Order');
      const docRef = await addDoc(ordersRef, orderData);

      console.log("Order added with ID:", docRef.id);

      // Return the new order with the generated ID
      return { id: docRef.id, ...orderData };
    } catch (error) {
      console.error('Error adding order:', error);
      return rejectWithValue('Failed to add order');
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
      })
      .addCase(addOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addOrder.fulfilled, (state, action) => {
        state.loading = false;
        // Add the new order to the state
        state.ordersData.push(action.payload);
      })
      .addCase(addOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default ordersSlice.reducer;
