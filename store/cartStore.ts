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
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  estimatedWeight: number;
  lastUpdated: number;
  configuration: {
    metal: string;
    purity: string;
    size?: string;
    stone?: string;
    customization?: string[];
  };
  pricingBreakdown?: {
    metalPrice: number;
    makingCharges: number;
    stonePrice: number;
    subTotal: number;
    gst: number;
    totalPrice: number;
    estimatedWeight: number;
    estimatedGoldWeight?: number;
    estimatedStoneWeight?: number;
    stoneName?: string;
    stoneWeightCarats?: number;
    isDiamond?: boolean;
    isStone?: boolean;
  };
}

interface CartStore {
  items: CartItem[];
  giftMessage: string;
  pincode: string;
  savedAddresses: Address[];
  selectedAddressId: string | null;
  lastSync: number;
  
  addItem: (item: CartItem) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number, mode?: 'duplicate' | 'new') => void;
  setItems: (items: CartItem[]) => void;
  clearCart: () => void;
  getTotal: () => number;
  
  setGiftMessage: (message: string) => void;
  setPincode: (pincode: string) => void;
  addAddress: (address: Address) => void;
  removeAddress: (id: string) => void;
  selectAddress: (id: string) => void;
  setLastSync: (time: number) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      giftMessage: '',
      pincode: '',
      savedAddresses: [],
      selectedAddressId: null,
      lastSync: 0,

      addItem: (newItem) => {
        set((state) => {
          // Check for existing item with the SAME configuration (cartItemId)
          const existingItem = state.items.find((item) => item.cartItemId === newItem.cartItemId);
          
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.cartItemId === newItem.cartItemId
                  ? { ...item, quantity: item.quantity + newItem.quantity, lastUpdated: Date.now() }
                  : item
              ),
            };
          }
          
          return { items: [...state.items, { ...newItem, lastUpdated: Date.now() }] };
        });
      },

      removeItem: (cartItemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.cartItemId !== cartItemId),
        }));
      },

      updateQuantity: (cartItemId, quantity, mode = 'duplicate') => {
        if (quantity < 1) return;

        set((state) => {
          const item = state.items.find(i => i.cartItemId === cartItemId);
          if (!item) return state;

          // If increasing quantity and mode is 'duplicate', we just increase it
          // In the UI, we will catch the increase and show a modal before calling this with the final decision.
          return {
            items: state.items.map((item) =>
              item.cartItemId === cartItemId 
                ? { ...item, quantity, lastUpdated: Date.now() } 
                : item
            ),
          };
        });
      },

      setItems: (items) => {
        set({ items });
      },

      clearCart: () => {
        set({ items: [], giftMessage: '', pincode: '', selectedAddressId: null });
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
      setLastSync: (lastSync) => set({ lastSync }),
    }),
    {
      name: 'zoniraz-cart',
    }
  )
);
