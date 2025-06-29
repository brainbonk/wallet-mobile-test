import { bscTestnet, arbitrumSepolia } from "@reown/appkit/networks";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";

// Get projectId from https://cloud.reown.com
export const projectId = process.env.REACT_APP_REOWN_PROJECT_ID;

if (!projectId) {
  throw new Error("Project ID is not defined");
}

// Create a metadata object - optional
export const metadata = {
  name: "Wallet Mobile Test",
  description: "Jammy Wallet Mobile Test",
  url: "https://jwmt.com", // origin must match your domain & subdomain
  icons: ["https://jammygame.com/img/favicon.ico"],
};

const reArbitrumSepolia = {
  ...arbitrumSepolia,
  contracts: {
    ...arbitrumSepolia.contracts,
    jammy: {
      address: process.env?.REACT_APP_CONTRACT_ADDRESS_421614,
      blockCreated: Number(process.env?.REACT_APP_CONTRACT_STARTER_BLOCK_421614),
    },
  },
  rpcUrls: {
    ...arbitrumSepolia.rpcUrls,
    extra: {
      blockRange: Number(process.env?.REACT_APP_BLOCKRANGE_421614),
      http: [process.env?.REACT_APP_EXTRARPCURL_421614],
      wss: process.env?.REACT_APP_EXTRASOCKETRPCURL_421614 ? [process.env?.REACT_APP_EXTRASOCKETRPCURL_421614] : [],
    },
  },
};

const reBscTestnet = {
  ...bscTestnet,
  contracts: {
    ...bscTestnet.contracts,
    jammy: {
      address: process.env?.REACT_APP_CONTRACT_ADDRESS_97,
      blockCreated: Number(process.env?.REACT_APP_CONTRACT_STARTER_BLOCK_97),
    },
  },
  rpcUrls: {
    ...bscTestnet.rpcUrls,
    extra: {
      blockRange: Number(process.env?.REACT_APP_BLOCKRANGE_97),
      http: [process.env?.REACT_APP_EXTRARPCURL_97],
      wss: process.env?.REACT_APP_EXTRASOCKETRPCURL_97 ? [process.env?.REACT_APP_EXTRASOCKETRPCURL_97] : [],
    },
  },
};

// for custom networks visit -> https://docs.reown.com/appkit/react/core/custom-networks
export const networks = [reArbitrumSepolia, reBscTestnet];

// Set up Solana Adapter
export const ethersAdapter = new EthersAdapter();
