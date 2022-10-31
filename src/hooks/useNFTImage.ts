import { useQuery } from "@tanstack/react-query";
import { useStore } from "../components/Store";

const useNFTImage = (tokenId: Number) => {
  const [getContract] = useStore((store) => store.getContract);
  const { contract } = getContract();
  return useQuery(["useNFTImage", tokenId], async () => {
    const uri: string = await contract.tokenURI(tokenId);

    return { uri };
  });
};

export default useNFTImage;
