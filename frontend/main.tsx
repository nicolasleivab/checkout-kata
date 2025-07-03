import ReactDOM from "react-dom/client";
import Checkout from "./presentation/views/Checkout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./presentation/styles/reset.css";

const qc = new QueryClient();
const root = document.getElementById("root")!;
ReactDOM.createRoot(root).render(
  <QueryClientProvider client={qc}>
    <Checkout />
  </QueryClientProvider>
);
