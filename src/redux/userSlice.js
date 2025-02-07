

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../firebase.config';  
import { doc, getDoc } from 'firebase/firestore';


export const fetchUserData = createAsyncThunk(
  "user/fetchUserData",
  async (phoneNumber, { rejectWithValue }) => {
    try {
      // Ensure phoneNumber does not have "+91"
      const formattedPhoneNumber = phoneNumber.startsWith("+91")
        ? phoneNumber.slice(3) // Remove "+91"
        : phoneNumber;

      console.log("Formatted phoneNumber Number for Firestore Query:", formattedPhoneNumber);

      const docRef = doc(db, "Customer", formattedPhoneNumber); // Use formatted phoneNumber
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        console.log("userdata redux file",userData.phoneNumber);
        return userData;
      } else {
        return rejectWithValue("User not found");
      }
      
    } catch (error) {
      console.error("Error fetching user data:", error);
      return rejectWithValue("Failed to fetch user data");
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
  
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.userData = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default userSlice.reducer;


