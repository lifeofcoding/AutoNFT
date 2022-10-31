import { useQuery } from "@tanstack/react-query";
import { useStore } from "../components/Store";

const useGetNFTs = () => {
  const [store] = useStore((store) => store);
  const { contract } = store.getContract();
  return useQuery<Object>(["getGetNFTs"], async () => {
    return await contract.count();
  });
};

export default useGetNFTs;
