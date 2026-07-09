import { create } from 'zustand'

export interface POSItem {
  id: string
  name: string
  price: number
  quantity: number
  sku: string
}

interface POSState {
  items: POSItem[]
  discount: number
  taxRate: number
  addItem: (item: POSItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  setDiscount: (amount: number) => void
  clearCart: () => void
  getSubtotal: () => number
  getTaxAmount: () => number
  getTotal: () => number
}

export const usePosStore = create<POSState>((set, get) => ({
  items: [],
  discount: 0,
  taxRate: 0.18, // 18% GST default

  addItem: (item) => set((state) => {
    const existingItem = state.items.find((i) => i.id === item.id)
    if (existingItem) {
      return {
        items: state.items.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        ),
      }
    }
    return { items: [...state.items, item] }
  }),

  removeItem: (id) => set((state) => ({
    items: state.items.filter((i) => i.id !== id),
  })),

  updateQuantity: (id, quantity) => set((state) => ({
    items: state.items.map((i) =>
      i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i
    ),
  })),

  setDiscount: (amount) => set({ discount: Math.max(0, amount) }),

  clearCart: () => set({ items: [], discount: 0 }),

  getSubtotal: () => {
    return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
  },

  getTaxAmount: () => {
    const subtotal = get().getSubtotal()
    const afterDiscount = Math.max(0, subtotal - get().discount)
    return afterDiscount * get().taxRate
  },

  getTotal: () => {
    const subtotal = get().getSubtotal()
    const afterDiscount = Math.max(0, subtotal - get().discount)
    return afterDiscount + get().getTaxAmount()
  },
}))
