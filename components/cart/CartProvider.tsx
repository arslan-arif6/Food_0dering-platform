"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type CartItem = {
  id: string;
  name: string;
  image: string;

  variantId: string;
  variantName: string;

  price: number;

  quantity: number;
};

type CartContextValue = {
  // New names expected by checkout
  items: CartItem[];
  total: number;

  // Old names kept so existing pages don't break
  cart: CartItem[];
  totalPrice: number;

  itemCount: number;

  addItem: (item: CartItem) => void;

  removeItem: (id: string, variantId: string) => void;

  increaseQuantity: (id: string, variantId: string) => void;

  decreaseQuantity: (id: string, variantId: string) => void;

  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("kitchenhub-cart");

      if (stored) {
        setCart(JSON.parse(stored));
      }
    } catch {
      console.error("Failed to load cart.");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("kitchenhub-cart", JSON.stringify(cart));
  }, [cart]);

  const addItem = useCallback((item: CartItem) => {
    setCart((current) => {
      const existing = current.find(
        (i) =>
          i.id === item.id &&
          i.variantId === item.variantId
      );

      if (existing) {
        return current.map((i) =>
          i.id === item.id &&
            i.variantId === item.variantId
            ? {
              ...i,
              quantity: i.quantity + 1,
            }
            : i
        );
      }

      return [...current, item];
    });
  }, []);

  const increaseQuantity = useCallback(
    (id: string, variantId: string) => {
      setCart((current) =>
        current.map((item) =>
          item.id === id &&
            item.variantId === variantId
            ? {
              ...item,
              quantity: item.quantity + 1,
            }
            : item
        )
      );
    },
    []
  );

  const decreaseQuantity = useCallback(
    (id: string, variantId: string) => {
      setCart((current) =>
        current.flatMap((item) => {
          if (
            item.id !== id ||
            item.variantId !== variantId
          ) {
            return item;
          }

          if (item.quantity === 1) {
            return [];
          }

          return {
            ...item,
            quantity: item.quantity - 1,
          };
        })
      );
    },
    []
  );

  const removeItem = useCallback(
    (id: string, variantId: string) => {
      setCart((current) =>
        current.filter(
          (item) =>
            !(
              item.id === id &&
              item.variantId === variantId
            )
        )
      );
    },
    []
  );

  const clearCart = useCallback(() => {
    setCart([]);
    localStorage.removeItem("kitchenhub-cart");
  }, []);

  const itemCount = useMemo(() => {
    return cart.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
  }, [cart]);

  const totalPrice = useMemo(() => {
    return cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        // New API
        items: cart,
        total: totalPrice,

        // Old API
        cart,
        totalPrice,

        itemCount,

        addItem,
        removeItem,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider.");
  }

  return context;
}