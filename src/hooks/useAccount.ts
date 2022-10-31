import { useQuery } from "@tanstack/react-query";
import { ethereum } from "../utils/constants";

const useAccount = () => {
  return useQuery<string>(["useAccount"], async () => {
    if (!ethereum) return alert("Please install MetaMask.");

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length) {
      return accounts[0];
    } else {
      console.log("No accounts found");
      return null;
    }
  });
};

export default useAccount;
