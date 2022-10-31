import { useQuery } from "@tanstack/react-query";
import { useStore } from "../components/Store";

const useNFTImage = (tokenId: Number) => {
  const [store] = useStore((store) => store);
  const { contract, signer } = store.getContract();
  return useQuery(["useNFTImage", tokenId], async () => {
    const uri: string = await contract.tokenURI(tokenId);
    const connection = contract.connect(signer);
    const addr = connection.address;
    debugger;
    const isOwned: boolean = await contract.isContentOwned(uri);

    const owner = await contract.getOwner(uri);
    console.log("owner", owner);

    debugger;

    const ownerTest = await contract.getOwnerTest(uri);
    console.log("ownerTest", ownerTest);

    debugger;

    const getsender1 = await contract.getSender();
    console.log("getsender1", getsender1);

    return { uri, isOwned };
  });
};

export default useNFTImage;
