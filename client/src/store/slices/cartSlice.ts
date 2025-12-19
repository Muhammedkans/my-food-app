import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  restaurantId: string;
  isVeg: boolean;
}

interface CartState {
  items: CartItem[];
  restaurantId: string | null; // Can only order from one restaurant at a time
  isOpen: boolean;
}

const initialState: CartState = {
  items: localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart') || '[]') : [],
  restaurantId: localStorage.getItem('cart_restaurant') || null,
  isOpen: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const item = action.payload;

      // Check if adding from a different restaurant
      if (state.restaurantId && state.restaurantId !== item.restaurantId) {
        if (!window.confirm('Adding items from a new restaurant will clear your current cart. Proceed?')) {
          return;
        }
        state.items = [];
      }

      state.restaurantId = item.restaurantId;

      const existingItem = state.items.find(i => i._id === item._id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push(item);
      }

      localStorage.setItem('cart', JSON.stringify(state.items));
      localStorage.setItem('cart_restaurant', state.restaurantId);
      state.isOpen = true; // Open cart when adding item
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(i => i._id !== action.payload);
      if (state.items.length === 0) {
        state.restaurantId = null;
        localStorage.removeItem('cart_restaurant');
      }
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    updateQuantity: (state, action: PayloadAction<{ id: string, delta: number }>) => {
      const item = state.items.find(i => i._id === action.payload.id);
      if (item) {
        item.quantity += action.payload.delta;
        if (item.quantity <= 0) {
          state.items = state.items.filter(i => i._id !== action.payload.id);
        }
      }
      if (state.items.length === 0) {
        state.restaurantId = null;
        localStorage.removeItem('cart_restaurant');
      }
      localStorage.setItem('cart', JSON.stringify(state.items)); // Sync storage
    },
    clearCart: (state) => {
      state.items = [];
      state.restaurantId = null;
      localStorage.removeItem('cart');
      localStorage.removeItem('cart_restaurant');
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    }
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, toggleCart } = cartSlice.actions;

// Selectors
export const selectCartTotal = (state: { cart: CartState }) =>
  state.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

export const selectCartCount = (state: { cart: CartState }) =>
  state.cart.items.reduce((count, item) => count + item.quantity, 0);

export default cartSlice.reducer;
