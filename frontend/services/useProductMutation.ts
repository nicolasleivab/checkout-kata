import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProductPricing } from "./api";
import { TUpdatePriceOfferParams } from "../types/products";

const PRODUCTS_QK = ["products"];

export function useProductMutation() {
  const queryClient = useQueryClient();

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
