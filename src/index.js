import { createRoot } from "react-dom/client";
import { init, backButton } from '@telegram-apps/sdk';
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

try {
  init(); // Init the package and actualize all global dependencies.
  backButton.mount(); // Mount the back button component and retrieve its actual state.

  // When a user clicked the back button, go back in the navigation history.
  const off = backButton.onClick(() => {
    off();
    window.history.back();
  });
} catch (error) {
  console.error("Failed to initialize Telegram SDK:", error);
}

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <WalletContextProvider>
      <App />
    </WalletContextProvider>
  </BrowserRouter>
);
