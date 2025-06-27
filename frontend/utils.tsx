import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, RenderHookOptions } from "@testing-library/react";

const createQueryClient = () =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });

export function renderHookWithClient<Result, Props>(
  hook: (props: Props) => Result,
  options?: Omit<RenderHookOptions<Props>, "wrapper">
) {
  const queryClient = createQueryClient();

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return renderHook(hook, { wrapper, ...options });
}
