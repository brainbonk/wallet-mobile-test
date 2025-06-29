import {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
} from "react";
import {
  useAppKit,
  useDisconnect,
  useAppKitNetwork,
  useAppKitAccount,
  useAppKitProvider,
  useWalletInfo,
} from "@reown/appkit/react";
import {
  JsonRpcProvider,
  BrowserProvider,
  JsonRpcSigner,
  Contract,
  formatEther,
} from "ethers";
import { networks } from "../../configs/reown";

import Bingo from "../../abis/artifacts/contracts/Jammy.sol/Jammy.json";

const disconnectedState = {
  accounts: [],
  isConnected: false,
  chainId: "",
  balance: 0,
  totalWon: null,
  rank: null,
};

const initialSigner = {
  provider: null,
  signer: null,
  contract: null,
  isDeployer: null,
  isAdmin: null,
  isHost: null,
};

const initialUnSigner = {
  provider: null,
  contract: null,
  socketProvider: null,
  socketSubId: null,
};

const WalletContext = createContext();

export const WalletContextProvider = ({ children }) => {
  const { open } = useAppKit();
  const { disconnect } = useDisconnect();
  const { chainId } = useAppKitNetwork();
  const { isConnected, address } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider("eip155");
  const walletInfo = useWalletInfo();
  const [currentChain, setCurrentChain] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const clearError = () => setErrorMessage("");

  const [wallet, setWallet] = useState(disconnectedState);
  const [signer, setSigner] = useState(initialSigner);
  const [unSigner, setUnSigner] = useState(initialUnSigner);
  const [fragments, setFragments] = useState([]);

  const [toastArgs, setToastArgs] = useState({
    msgType: null,
    msg: null,
    isShow: false,
  });

  const connectContract = async (_currentChain) => {
    unSigner.contract?.interface.forEachEvent((item) =>
      setFragments((oldValues) => [...oldValues, item])
    );
    unSigner.contract?.interface.forEachError((item) =>
      setFragments((oldValues) => [...oldValues, item])
    );
    unSigner.contract?.interface.forEachFunction((item) =>
      setFragments((oldValues) => [...oldValues, item])
    );

    try {
      let _socketProvider = null;
      let _subscriptionId = null;

      const jsonRpcProvider = new JsonRpcProvider(
        _currentChain.rpcUrls.extra.http[0]
      );
      const _unSignerContract = new Contract(
        _currentChain.contracts.jammy.address,
        Bingo.abi,
        jsonRpcProvider
      );

      if (_unSignerContract) {
        setUnSigner({
          provider: jsonRpcProvider,
          contract: _unSignerContract,
          socketProvider: _socketProvider,
          socketSubId: _subscriptionId,
        });
      }

      // set Contract
      if (isConnected && address) {
        const provider = new BrowserProvider(walletProvider, chainId);
        const signer = new JsonRpcSigner(provider, address);
        const _bingoContract = new Contract(
          _currentChain.contracts.jammy.address,
          Bingo.abi,
          signer
        );

        const balance = Number(
          Number(
            formatEther(await provider.getBalance(address, "latest"))
          ).toFixed(6)
        );
        setWallet({
          accounts: [address.toLowerCase()],
          isConnected,
          chainId,
          balance,
          totalWon: null,
          rank: null,
        });

        if (signer && _bingoContract) {
          setSigner({
            provider,
            signer,
            contract: _bingoContract,
            isDeployer: Boolean(
              (await _bingoContract.deployer()).toLowerCase() ===
                address.toLowerCase()
            ),
            isAdmin: Boolean(await _bingoContract.admins(address)),
            isHost: Boolean(await _bingoContract.hosts(address)),
          });
        }
      } else {
        setWallet(disconnectedState);
      }

      clearError();
    } catch (err) {
      console.log("useWalletConnection:", err);
      setErrorMessage(err);
    }
  };

  const _loadWallet = useCallback(async () => {
    // if (typeof window.ethereum === "undefined") return;
    if (!isConnected) connectContract(networks[1]); //default network
    if (chainId) {
      const _currentChain = networks.find((chain) => chain.id === chainId);
      if (_currentChain) {
        setSigner(initialSigner);
        setUnSigner(initialUnSigner);
        setWallet(disconnectedState);
        setCurrentChain(_currentChain);
        if (_currentChain.id !== 1) {
          connectContract(_currentChain);
        } else {
          if (isConnected && address) {
            setWallet({
              accounts: [address.toLowerCase()],
              isConnected,
              chainId,
            });
          }
        }
      } else {
        open({ view: "Networks" });
      }
    }
  }, [isConnected, address, chainId]);

  const connect = async () => {
    clearError();
    open();
  };

  const disConnect = async () => {
    console.log("disconnecting wallet...");
    clearError();
    disconnect();
    setSigner(initialSigner);
    setWallet(disconnectedState);
  };

  const getFragment = (type, selector) => {
    const res = fragments.find(
      (item) => item.type === type && item.selector === selector
    );
    if (res) return res;
  };

  useEffect(() => {
    _loadWallet();
  }, [_loadWallet]);

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        currentChain,
        connectedWalletInfo: walletInfo !== undefined && walletInfo.name,
        address,
        chainId,
        wallet,
        setWallet,
        signer,
        unSigner,
        contractAbi: Bingo,
        error: !!errorMessage,
        errorMessage,
        clearError,
        open,
        connect,
        disConnect,
        fragments,
        getFragment,
        toastArgs,
        setToastArgs,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWalletConnection = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error(
      'useWalletConnection must be used within a "WalletContextProvider"'
    );
  }
  return context;
};
