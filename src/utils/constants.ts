import Contract from "../artifacts/contracts/NFT.sol/RousseauNFTs.json";
const contractABI = Contract.abi;
const contractAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
const ethereum =
  typeof window !== "undefined" && window.hasOwnProperty("ethereum")
    ? (window as any).ethereum
    : undefined;

export { contractABI, contractAddress, ethereum };
