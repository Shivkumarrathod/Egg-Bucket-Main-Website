import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import ordersReducer from "./orderSlice";
import localStorageReducer from "./localStorageSlice"; // Import the new slice

export const store = configureStore({
  reducer: {
    user: userReducer,
    orders: ordersReducer,
    localStorage: localStorageReducer, // Add the new reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
