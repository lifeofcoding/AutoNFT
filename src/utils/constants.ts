import Contract from "../artifacts/contracts/NFT.sol/RousseauNFTs.json";
const contractABI = Contract.abi;
const contractAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
const ethereum =
  typeof window !== "undefined" && window.hasOwnProperty("ethereum")
    ? (window as any).ethereum
    : undefined;

export { contractABI, contractAddress, ethereum };
