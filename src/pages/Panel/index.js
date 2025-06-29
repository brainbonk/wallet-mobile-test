import { useState, useEffect } from "react";
import { useWalletConnection } from "../../utility/hooks/useWalletConnection";
import UserProfile from "../../components/UserProfile/UserProfile";

function Panel() {
  const {
    isConnected,
    currentChain,
    connectedWalletInfo,
    address,
    chainId,
    wallet,
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

  const [contractCards, setContractCards] = useState([]);

  const contractGetCards = async () => {
    const _contractCards = await signer.contract.getCards();
    setContractCards(_contractCards);
  };

  useEffect(() => {
    if (typeof window.ethereum !== "undefined" && signer.contract) {
      try {
        contractGetCards();
      } catch (error) {
        console.error(error.reason);
      }
    }
  }, [signer.contract]);

  //Event Listeners
  useEffect(() => {
    sessionStorage.setItem("@appkit/connection_status", "connected");

    if (!unSigner.contract) return;

    const listenerAdminSet = (account, state) => {
      console.log("AdminSet event was emmited");
      console.log("account:", account.toString());
      console.log("state:", state.toString());
    };
    const listenerHostSet = (account, state) => {
      console.log("HostSet event was emmited");
      console.log("account:", account.toString());
      console.log("state:", state.toString());
    };
    const listenerCardsAdded = (amount, newCount) => {
      console.log("CardsAdded event was emmited");
      console.log("amount:", amount.toString());
      console.log("newCount:", newCount.toString());
    };
    const listenerCardsUpdated = (amount) => {
      console.log("CardsUpdated event was emmited");
      console.log("amount:", amount.toString());
    };

    unSigner.contract?.on("AdminSet", listenerAdminSet);
    unSigner.contract?.on("HostSet", listenerHostSet);
    unSigner.contract?.on("CardsAdded", listenerCardsAdded);
    unSigner.contract?.on("CardsUpdated", listenerCardsUpdated);
    return () => {
      sessionStorage.setItem("@appkit/connection_status", "disconnected");
      unSigner.contract?.off("AdminSet", listenerAdminSet);
      unSigner.contract?.off("HostSet", listenerHostSet);
      unSigner.contract?.off("CardsAdded", listenerCardsAdded);
      unSigner.contract?.off("CardsUpdated", listenerCardsUpdated);
    };
  }, [unSigner.contract]);

  return (
    <div className="AppPanel" style={{ textAlign: "center" }}>
      <header
        style={{
          backgroundColor: "#444",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#000",
        }}
      >
        <>
          <h1 style={{ color: "yellow" }}>Wallet Mobile Test</h1>
          <div style={{ marginBottom: "20px" }}>
            <UserProfile />
          </div>
          <div>
            <div
              style={{
                padding: "10px",
                margin: "4px",
                color: "yellow",
              }}
            >
              Cards Count: {contractCards.length}
            </div>
            <div>
              <p>localStorage (connection_status): {localStorage.getItem("@appkit/connection_status") || "No connection_status"}</p>
              <p>sessionStorage (connection_status): {sessionStorage.getItem("@appkit/connection_status") || "No connection_status"}</p>
            </div>
          </div>
        </>
      </header>
    </div>
  );
}

export default Panel;
