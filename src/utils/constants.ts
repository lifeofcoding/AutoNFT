import Contract from "../artifacts/contracts/NFT.sol/RousseauNFTs.json";
const contractABI = Contract.abi;
const contractAddress = "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318";
const ethereum =
  typeof window !== "undefined" && window.hasOwnProperty("ethereum")
    ? (window as any).ethereum
    : undefined;

export { contractABI, contractAddress, ethereum };
