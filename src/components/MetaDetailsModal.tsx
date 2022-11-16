import { useId, useState, useRef } from "react";
import { create } from "ipfs-http-client";
import { useAlerts } from "./layout/Alerts";
import { useStore } from "./Store";
import { ethers } from "ethers";

const projectId = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID;
const projectSecret = process.env.NEXT_PUBLIC_INFURA_PROJECT_SECRET;

type MetaDetailsModalProps = {
  fileUrl: string | null;
  open: boolean;
  onClose: () => void;
};

const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

const client = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

const MetaDetailsModal = ({
  fileUrl,
  open,
  onClose,
}: MetaDetailsModalProps) => {
  const [store] = useStore((store) => store);

  const modalId = useId();
  const alert = useAlerts();

  const formRef = useRef<HTMLFormElement | null>(null);

  const getFormData = () => {
    const formData = new FormData(formRef.current!);
    return Object.fromEntries(formData.entries());
  };

  async function uploadToIPFS() {
    const { name, description } = getFormData();
    const data = JSON.stringify({
      name,
      description,
      image: fileUrl,
    });
    try {
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      return url;
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  const onSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const { contract, signer } = store.getContract();
    const { name, description } = getFormData();

    if (!name || !description || !fileUrl) {
      return alert({
        type: "error",
        message: "All fields are required",
      });
    }
    const url = await uploadToIPFS();
    if (!url) {
      return alert({
        type: "error",
        message: "Unable to upload Image to IPFS",
      });
    }

    console.log("url", url);

    try {
      const urlParts = url.split("/");
      const connection = contract.connect(signer);
      const addr = connection.address;
      const contentId = urlParts[urlParts.length - 1];

      const result = await contract.payToMint(addr, contentId, {
        value: ethers.utils.parseEther("0.05"),
      });

      console.log("result", result);

      await result.wait();
      onClose();
      alert({ type: "success", message: "New NFT Minted SUccessfully" });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed";
      alert({ type: "error", message: errorMessage });
    }
  };
  return (
    <div
      id={modalId}
      tabIndex={-1}
      aria-hidden="true"
      className={`${
        open ? "" : "hidden"
      } h-modal fixed top-0 right-0 left-0 z-0 flex w-full items-center justify-center overflow-y-auto overflow-x-hidden bg-[#FFFFFF90] backdrop-blur-lg backdrop-filter md:inset-0 md:h-full`}
    >
      <div className="relative h-full w-full max-w-2xl p-4 md:h-auto">
        <div className="relative rounded-lg bg-white shadow dark:bg-gray-700">
          <div className="flex items-start justify-between rounded-t border-b p-4 dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Mint NFT
            </h3>
            <button
              type="button"
              className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={onClose}
            >
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="space-y-6 p-6">
            <form
              onSubmit={onSubmit}
              className="flex justify-center"
              ref={formRef}
            >
              <div className="flex w-1/2 flex-col pb-12">
                <input
                  placeholder="Asset Name"
                  className="mt-8 rounded border p-4"
                  name="name"
                />
                <textarea
                  placeholder="Asset Description"
                  className="mt-2 rounded border p-4"
                  name="description"
                />

                <button
                  type="submit"
                  className="mt-4 rounded bg-teal-400 p-4 font-bold text-white shadow-lg"
                >
                  Mint and list NFT
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetaDetailsModal;
