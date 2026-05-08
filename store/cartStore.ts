import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  type: 'Home' | 'Office' | 'Other';
  isDefault?: boolean;
}

export interface CartItem {
  cartItemId: string; // Unique ID based on productId + configuration
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  estimatedWeight: number;
  configuration: {
    metal: string;
    purity: string;
    size?: string;
    stone?: string;
    customization?: string[];
  };
}

interface CartStore {
  items: CartItem[];
  giftMessage: string;
  pincode: string;
  savedAddresses: Address[];
  selectedAddressId: string | null;
  
  addItem: (item: CartItem) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  setItems: (items: CartItem[]) => void;
  clearCart: () => void;
  getTotal: () => number;
  
  setGiftMessage: (message: string) => void;
  setPincode: (pincode: string) => void;
  addAddress: (address: Address) => void;
  removeAddress: (id: string) => void;
  selectAddress: (id: string) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      giftMessage: '',
      pincode: '',
      savedAddresses: [],
      selectedAddressId: null,

      addItem: (newItem) => {
        set((state) => {
          // Check for existing item with the SAME configuration (cartItemId)
          const existingItem = state.items.find((item) => item.cartItemId === newItem.cartItemId);
          
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.cartItemId === newItem.cartItemId
                  ? { ...item, quantity: item.quantity + newItem.quantity }
                  : item
              ),
            };
          }
          
          return { items: [...state.items, newItem] };
        });
      },

      removeItem: (cartItemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.cartItemId !== cartItemId),
        }));
      },

      updateQuantity: (cartItemId, quantity) => {
        if (quantity < 1) return;

        set((state) => ({
          items: state.items.map((item) =>
            item.cartItemId === cartItemId ? { ...item, quantity } : item
          ),
        }));
      },

      setItems: (items) => {
        set({ items });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      setGiftMessage: (message) => set({ giftMessage: message }),
      setPincode: (pincode) => set({ pincode }),
      
      addAddress: (address) => set((state) => ({ 
        savedAddresses: [...state.savedAddresses, address],
        selectedAddressId: state.selectedAddressId || address.id
      })),
      
      removeAddress: (id) => set((state) => ({
        savedAddresses: state.savedAddresses.filter(a => a.id !== id),
        selectedAddressId: state.selectedAddressId === id ? null : state.selectedAddressId
      })),
      
      selectAddress: (id) => set({ selectedAddressId: id }),
    }),
    {
      name: 'zoniraz-cart',
    }
  )
);
