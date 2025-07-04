import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProductPricing } from "./api";
import { TUpdatePriceOfferParams } from "../types/products";
import { useCart } from "../contexts/CartContext";
import { PRODUCTS_QK } from "./useProducts";

export function useProductMutation() {
  const queryClient = useQueryClient();
  const { clearCart } = useCart();

  const mutation = useMutation({
    mutationFn: ({
      sku,
      data,
      authToken,
    }: {
      sku: string;
      data: TUpdatePriceOfferParams;
      authToken?: string;
    }) => updateProductPricing(sku, data, authToken),

    onSuccess: () => {
      // Invalidate and refetch products after successful mutation
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QK });
      // Clear the cart since prices have changed
      clearCart();
    },

    onError: (error: Error) => {
      console.error("Product mutation failed:", error);
    },
  });

  return {
    updatePricing: mutation.mutate,
    updatePricingAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
  };
}
