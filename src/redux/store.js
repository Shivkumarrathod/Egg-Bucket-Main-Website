import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
// import costumerReducer from "./costumerSlice"
import ordersReducer from "./orderSlice"

export const store = configureStore({
  reducer: {
    user: userReducer,
    // costumer:costumerReducer,
    orders: ordersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
