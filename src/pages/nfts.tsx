import type { NextPage, GetStaticProps } from "next";
import Image from "next/image";
import Head from "next/head";
import { useRef, useState, useCallback, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAlerts } from "../components/layout/Alerts";
import { useStore } from "../components/Store";
import useGetNFTs from "../hooks/useGetNFTs";
import useNFTImage from "../hooks/useNFTImage";

function NFTImage({ tokenId }: { tokenId: Number }) {
  const [isOwned, setIsOwned] = useState(false);
  const [getContract] = useStore((store) => store.getContract);
  const { contract } = getContract();
  const { data } = useNFTImage(tokenId);

  if (!data) return null;

  return (
    <div>
      <img src={`/api/nft?uri=${data.uri}`} className="h-36 w-36"></img>
    </div>
  );
}

const Dashboard: NextPage = () => {
  const { data: count } = useGetNFTs();
  const nfts = count ? Array(parseInt(count as string)).fill(0) : [];

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
          <div className=" grid h-3/5 w-full grid-cols-2 rounded bg-white p-2">
            {nfts.map((_, i) => (
              <div key={i} className="flex items-center justify-center">
                <NFTImage tokenId={i} />
              </div>
            ))}
            <div className="flex items-center justify-center">
              <NFTImage tokenId={0} />
            </div>
            <div className="flex items-center justify-center">
              <NFTImage tokenId={0} />
            </div>
          </div>
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
