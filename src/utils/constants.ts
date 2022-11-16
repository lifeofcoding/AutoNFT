import Contract from "../artifacts/contracts/NFT.sol/RousseauNFTs.json";
const contractABI = Contract.abi;
const contractAddress = process.env.CONTRACT_ADDRESS ?? "";
const ethereum =
  typeof window !== "undefined" && window.hasOwnProperty("ethereum")
    ? (window as any).ethereum
    : undefined;

export { contractABI, contractAddress, ethereum };
