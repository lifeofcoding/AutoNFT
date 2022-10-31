import type { NextPage, GetStaticProps } from "next";
import Image from "next/image";
import Head from "next/head";
import { useRef, useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAlerts } from "../components/layout/Alerts";
import { useStore } from "../components/Store";
import useGetNFTs from '../hooks/useGetNFTs';

function NFTImage({ tokenId }: {tokenId: Number}) {
  const contentId = 'NFT';
  const metadataURI = `${contentId}/${tokenId}.json`;
  const imageURI = `https://gateway.pinata.cloud/ipfs/${contentId}/${tokenId}.png`;

  const [isMinted, setIsMinted] = useState(false);
  useEffect(() => {
    getMintedStatus();
  }, [isMinted]);

  const getMintedStatus = async () => {
    const result = await contract.isContentOwned(metadataURI);
    console.log(result)
    setIsMinted(result);
  };

  const mintToken = async () => {
    const connection = contract.connect(signer);
    const addr = connection.address;
    const result = await contract.payToMint(addr, metadataURI, {
      value: ethers.utils.parseEther('0.05'),
    });

    await result.wait();
    getMintedStatus();
    getCount();
  };

  async function getURI() {
    const uri = await contract.tokenURI(tokenId);
    alert(uri);
  }
  return (
    <div>
      <img src={isMinted ? imageURI : 'img/placeholder.png'}></img>
        <h5>ID #{tokenId}</h5>
        {!isMinted ? (
          <button onClick={mintToken}>
            Mint
          </button>
        ) : (
          <button onClick={getURI}>
            Taken! Show URI
          </button>
        )}
    </div>
  );
}

const Dashboard: NextPage = () => {
  const { data: count } = useGetNFTs();

  return (
    <>
      <Head>
        <title>NFTS</title>
        <meta
          name="description"
          content="Created by Jimmy Rousseau @lifeofcoding"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        <div className="flex h-screen w-full  flex-col items-center justify-center">
          <div className="flex h-3/5 w-full items-center justify-center  rounded bg-white p-2">
            {Array(count)
        .fill(0)
        .map((_, i) => (
            <div key={i}>
            <NFTImage tokenId={i} />
            </div>
        ))}
        </div>
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {
      requiresLogin: true,
    },
  };
};

export default Dashboard;
