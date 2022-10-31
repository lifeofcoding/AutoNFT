import type { NextPage, GetStaticProps } from "next";
import Image from "next/image";
import Head from "next/head";
import { useRef, useState, useCallback, useEffect, useMemo } from "react";
import { useStore } from "../components/Store";
import useGetNFTs from "../hooks/useGetNFTs";
import useNFTImage from "../hooks/useNFTImage";
import useGetMyNFTs from "../hooks/useGetMyNFTs";
import { BigNumber } from "ethers";

function NFTImage({ tokenId }: { tokenId: BigNumber }) {
  const { data } = useNFTImage(parseInt(tokenId.toString()));

  if (!data) return null;

  return (
    <div>
      <img src={`/api/nft?uri=${data.uri}`} className="h-36 w-36"></img>
    </div>
  );
}

const Dashboard: NextPage = () => {
  const { data } = useGetMyNFTs();

  const nftList = useMemo(() => {
    // const nfts = count ? Array(parseInt(count as string)).fill(0) : [];
    return data?.map((d, i) => (
      <div key={i} className="flex items-center justify-center border">
        <NFTImage tokenId={d.tokenId} />
      </div>
    ));
  }, [data]);

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
            {nftList}
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
