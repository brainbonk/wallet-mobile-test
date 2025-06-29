import { createRoot } from "react-dom/client";
import { createAppKit } from "@reown/appkit/react";
import { networks, projectId, metadata, ethersAdapter } from "./configs/reown";
import { BrowserRouter } from "react-router-dom";
import { WalletContextProvider } from "./utility/hooks/useWalletConnection";
import App from "./App";

createAppKit({
  adapters: [ethersAdapter],
  networks,
  metadata,
  projectId,
  themeMode: "dark",
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
    socials: false,
    email: false,
    legalCheckbox: true,
    swaps: false,
    send: false,
    onramp: false,
  },
  themeVariables: {
    "--w3m-accent": "#369",
  },
});

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <WalletContextProvider>
      <App />
    </WalletContextProvider>
  </BrowserRouter>
);
