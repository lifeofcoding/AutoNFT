import { useQuery } from "@tanstack/react-query";
import { useStore } from "../components/Store";

const useNFTImage = (tokenId: Number) => {
  const [store] = useStore((store) => store);
  const { contract } = store.getContract();
  return useQuery(["useNFTImage"], async () => {
    const uri: string = await contract.tokenURI(tokenId);
    const isOwned: boolean = await contract.isContentOwned(uri);

    return { uri, isOwned };
  });
};

export default useNFTImage;
