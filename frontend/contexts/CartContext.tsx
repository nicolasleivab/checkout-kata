import { createContext, useContext, ReactNode } from "react";

interface CartContextType {
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({
  children,
  clearCart,
}: {
  children: ReactNode;
  clearCart: () => void;
}) {
  return (
    <CartContext.Provider value={{ clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
