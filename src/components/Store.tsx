import React, {
  useRef,
  createContext,
  useContext,
  useCallback,
  useSyncExternalStore,
  useState,
  useEffect,
} from "react";
import { ethers } from "ethers";
import { contractABI, contractAddress, ethereum } from "../utils/constants";
import { useQueryClient } from "@tanstack/react-query";
import { useAlerts } from "./layout/Alerts";

type Store = {
  account: string;
  connectWallet: () => Promise<any>;
  getContract: () => {
    signer: ethers.providers.JsonRpcSigner;
    contract: ethers.Contract;
  };
};

const getAccount = async () => {
  try {
    if (!ethereum) return null;

    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    return accounts[0] as string;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getContract = () => {
  // if (!ethereum) return null;
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, contractABI, signer);

  return { signer, contract };
};

function useStoreData(): {
  get: () => Store;
  set: (value: Partial<Store>) => void;
  subscribe: (callback: () => void) => () => void;
} {
  const queryClient = useQueryClient();
  const alert = useAlerts();

  const connectWallet = useCallback(async () => {
    const account = getAccount();
    if (!account)
      return alert({ type: "error", message: "Unable to get account" });

    queryClient.invalidateQueries(["useAccount"]);

    const accountsChanged = () => {
      queryClient.invalidateQueries(["useAccount"]);
    };
    ethereum.on("accountsChanged", accountsChanged);
  }, [queryClient, alert]);

  const store = useRef({
    account: "",
    connectWallet,
    getContract,
  });

  const get = useCallback(() => store.current, []);

  const subscribers = useRef(new Set<() => void>());

  const set = useCallback((value: Partial<Store>) => {
    store.current = { ...store.current, ...value };
    subscribers.current.forEach((callback) => callback());
  }, []);

  const subscribe = useCallback((callback: () => void) => {
    subscribers.current.add(callback);
    return () => subscribers.current.delete(callback);
  }, []);

  return {
    get,
    set,
    subscribe,
  };
}

type UseStoreDataReturnType = ReturnType<typeof useStoreData>;

const StoreContext = createContext<UseStoreDataReturnType | null>(null);

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <StoreContext.Provider value={useStoreData()}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore<SelectorOutput>(
  selector: (store: Store) => SelectorOutput
): [SelectorOutput, (value: Partial<Store>) => void] {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error("Store not found");
  }

  // const state = useSyncExternalStore(store.subscribe, () =>
  //   selector(store.get())
  // );

  const [state, setState] = useState(store.get());

  useEffect(() => store.subscribe(() => setState(store.get())));

  return [selector(state), store.set];
}
