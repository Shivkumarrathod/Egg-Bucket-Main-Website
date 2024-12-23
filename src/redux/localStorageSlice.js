

import { createSlice } from "@reduxjs/toolkit";

// Helper function to load items from localStorage (if any)
const loadItemsFromLocalStorage = () => {
  const items = localStorage.getItem('cartItems');
  return items ? JSON.parse(items) : [];
};

const initialState = {
  items: loadItemsFromLocalStorage(), // Load initial items from localStorage
};

const localStorageSlice = createSlice({
  name: "localStorage",
  initialState,
  reducers: {
    addItem: (state, action) => {
      const existingItem = state.items.find((item) => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1; // Increment by 1
      } else {
        state.items.push({ ...action.payload, quantity: 1 }); // Add new item with quantity 1
      }
      saveToLocalStorage(state.items); // Sync with localStorage
    },

    decrementItem: (state, action) => {
      const existingItem = state.items.find((item) => item.id === action.payload);
      if (existingItem) {
        if (existingItem.quantity > 1) {
          existingItem.quantity -= 1; // Decrement quantity
        } else {
          state.items = state.items.filter((item) => item.id !== action.payload); // Remove item
        }
      }
      saveToLocalStorage(state.items); // Sync with localStorage
    },

    removeItem: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload); // Remove item
      saveToLocalStorage(state.items); // Sync with localStorage
    },
  },
});

// Helper function to save items to localStorage
const saveToLocalStorage = (items) => {
  localStorage.setItem('cartItems', JSON.stringify(items));
};

export const { addItem, decrementItem, removeItem } = localStorageSlice.actions;
export default localStorageSlice.reducer;
