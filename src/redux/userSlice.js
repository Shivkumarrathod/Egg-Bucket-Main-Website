

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../firebase.config';  
import { doc, getDoc } from 'firebase/firestore';


export const fetchUserData = createAsyncThunk(
  'user/fetchUserData',
  async (phoneNumber, { rejectWithValue }) => {
    try {
     

      const formattedPhoneNumber = phoneNumber.startsWith('+')
        ? phoneNumber.slice(1)
        : phoneNumber;

      console.log("Formatted Phone Number for Firestore Query:", formattedPhoneNumber);


      const docRef = doc(db, 'Customer', formattedPhoneNumber);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
      
        return userData;  
      } else {
        return rejectWithValue('User not found');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      return rejectWithValue('Failed to fetch user data');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userData: null,
    loading: false,
    error: null,
  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
