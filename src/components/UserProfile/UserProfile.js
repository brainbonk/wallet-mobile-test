import { useState, useEffect } from "react";
import { useWalletConnection } from "../../utility/hooks/useWalletConnection";
import { toBigInt, formatEther } from "ethers";

const UserProfile = () => {
  const {
    isConnected,
    currentChain,
    connectedWalletInfo,
    address,
    chainId,
    wallet,
    setWallet,
    signer,
    unSigner,
    contractAbi,
    error,
    errorMessage,
    clearError,
    open,
    connect,
    disConnect,
    fragments,
    getFragment,
    toastArgs,
    setToastArgs,
  } = useWalletConnection();

  const handleConnectWallet = async () => {
    await connect();
  };

  return (
    <div>
      {wallet.accounts.length < 1 && (
        <div
          className="btn btn-wallet"
          onClick={() => handleConnectWallet()}
        >
          <div className="sub-title">Connect Wallet</div>
        </div>
      )}
      {isConnected && wallet.accounts.length > 0 && (
        <>
          <div
            className="btn btn-wallet"
            onClick={() => disConnect()}
          >
            {wallet.accounts[0]}
          </div>
          <div
            onClick={() => open({ view: "Networks" })}
            className="btn btn-network"
          >
            Network: {currentChain.name}
          </div>
        </>
      )}
    </div>
  );
};
export default UserProfile;
