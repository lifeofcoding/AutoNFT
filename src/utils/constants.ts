import Contract from "../artifacts/contracts/NFT.sol/RousseauNFTs.json";
const contractABI = Contract.abi;
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const ethereum =
  typeof window !== "undefined" && window.hasOwnProperty("ethereum")
    ? (window as any).ethereum
    : undefined;

export { contractABI, contractAddress, ethereum };
