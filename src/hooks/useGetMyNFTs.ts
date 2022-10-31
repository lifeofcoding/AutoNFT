import { useQuery } from "@tanstack/react-query";
import { BigNumber } from "ethers";
import { useStore } from "../components/Store";

type NFTS = {
  0: BigNumber;
  1: string;
  owner: string;
  tokenId: BigNumber;
}[];

const useGetMyNFTs = () => {
  const [getContract] = useStore((store) => store.getContract);
  const { contract } = getContract();
  return useQuery(["useGetMyNFTs"], async () => {
    const nfts: NFTS = await contract.getMyNfts();

    return nfts;
  });
};

export default useGetMyNFTs;
