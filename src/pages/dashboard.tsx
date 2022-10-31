import type { NextPage, GetStaticProps } from "next";
import Image from "next/image";
import Head from "next/head";
import { useRef, useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import type { Prediction } from "./api/generate";
import { useAlerts } from "../components/layout/Alerts";
import MetaDetailsModal from "../components/MetaDetailsModal";

const postText = async (text: string) => {
  const rawResponse = await fetch("/api/generate", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  }).then((r) => r.json());

  return rawResponse as Prediction;
};

const Dashboard: NextPage = () => {
  const textRef = useRef<HTMLInputElement | null>(null);
  const [prediction, setPrediction] = useState<null | string>(null);
  const alert = useAlerts();
  const [modalOpen, setModalOpen] = useState(false);
  const { mutate, isLoading } = useMutation(postText, {
    onSuccess: (data) => {
      if (data.prediction.length && data.prediction[0]) {
        setPrediction(data.prediction[0]);
      }

      if (data.error) {
        alert({ message: data.error, type: "error" });
      }
    },
  });

  // const isLoading = true;

  const onSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const text = textRef.current?.value;

    if (text) mutate(text);
  };

  const mintNft = () => {
    setModalOpen(true);
  };

  const onModalClose = useCallback(() => {
    setModalOpen(false);
  }, []);

  return (
    <>
      <Head>
        <title>Dashboard</title>
        <meta
          name="description"
          content="Created by Jimmy Rousseau @lifeofcoding"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        <div className="flex h-screen w-full  flex-col items-center justify-center">
          <div className="flex h-3/5 w-full items-center justify-center  rounded bg-white p-2">
            {!prediction && !isLoading ? (
              <div>Start by typing something create in the prompt below.</div>
            ) : null}

            {isLoading ? (
              <div className="h-full w-full rounded-md border-2">
                <div className="flex h-full animate-pulse flex-row items-center justify-center space-x-5">
                  <div className="rounded-50 flex h-full w-full items-center justify-center bg-gray-300">
                    <p>Generating...</p>
                  </div>
                </div>
              </div>
            ) : null}

            {prediction && !isLoading ? (
              <div className="relative h-full w-full cursor-pointer">
                <Image
                  alt="Prediction"
                  src={prediction}
                  layout="fill"
                  objectFit="contain"
                  onClick={() => window.open(prediction)}
                />
              </div>
            ) : null}
          </div>
          <div className="m-[5px]">
            <form
              onSubmit={onSubmit}
              className=" flex flex-col items-center gap-5 sm:flex-row"
            >
              <input
                className="focus:shadow-outline w-96 appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
                id="text"
                type="text"
                name="text"
                placeholder="Enter AI instructtions"
                ref={textRef}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="mr-3 rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 md:mr-0"
              >
                Submit
              </button>
            </form>
          </div>
          {prediction && !isLoading && (
            <div className="m-[5px]">
              <button
                type="button"
                onClick={mintNft}
                className="mr-3 rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 md:mr-0"
              >
                Mint New NFT
              </button>
            </div>
          )}
          <MetaDetailsModal
            fileUrl={prediction}
            open={modalOpen}
            onClose={onModalClose}
          />
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
