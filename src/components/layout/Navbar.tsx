import NextLink from "next/link";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { signOut } from "firebase/auth";
import { useStore } from "../Store";
import useAccount from "../../hooks/useAccount";
import { shortenAddress } from "../../utils/shortenAddress";

function Navbar({ path }: { path: string }) {
  const [connectWallet] = useStore((store) => store.connectWallet);
  const { data: account } = useAccount();

  const [isOpen, setOpen] = useState(false);
  const openMenu = () => {
    setOpen(true);
  };

  const mouseDownListener = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", mouseDownListener);

      return () => document.removeEventListener("mousedown", mouseDownListener);
    }
  }, [isOpen, mouseDownListener]);

  const activeLinkClass =
    "block rounded bg-blue-700 py-2 pr-4 pl-3 text-white dark:text-white md:bg-transparent md:p-0 md:text-blue-700";
  const inactiveLinkClass =
    "block rounded py-2 pr-4 pl-3 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:p-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-white";
  return (
    <nav className="sticky top-0 left-0 z-20 w-full border-b border-gray-200 bg-white bg-opacity-40 p-5 px-2 py-2.5 backdrop-blur-lg backdrop-filter dark:border-gray-600 dark:bg-gray-900 sm:px-4">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        <NextLink href="/">
          <a className="flex items-center">
            <Image
              src="/logo.svg"
              height="30px"
              width="35px"
              className="mr-3 h-6 sm:h-9"
              alt="Flowbite Logo"
            />
            <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
              AutoNFT
            </span>
          </a>
        </NextLink>
        <div className="flex md:order-2">
          {!account && (
            <button
              onClick={connectWallet}
              type="button"
              className="mr-3 rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 md:mr-0"
            >
              Get started
            </button>
          )}
          {account && (
            <div className="flex items-center gap-2">
              {shortenAddress(account)}
            </div>
          )}
          <button
            data-collapse-toggle="navbar-sticky"
            type="button"
            className="inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 md:hidden"
            aria-controls="navbar-sticky"
            aria-expanded="false"
            onClick={openMenu}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="h-6 w-6"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
        <div
          className={`${
            isOpen ? "" : "hidden"
          } w-full items-center justify-between md:order-1 md:flex md:w-auto`}
          id="navbar-sticky"
        >
          <ul className="mt-4 flex flex-col rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800 md:mt-0 md:flex-row md:space-x-8 md:border-0 md:bg-white md:text-sm md:font-medium md:dark:bg-gray-900">
            <li>
              <NextLink href="/">
                <a
                  className={path === "/" ? activeLinkClass : inactiveLinkClass}
                  aria-current="page"
                >
                  Home
                </a>
              </NextLink>
            </li>
            <li>
              <NextLink href="/nfts">
                <a
                  className={path === "/" ? activeLinkClass : inactiveLinkClass}
                  aria-current="page"
                >
                  NFTs
                </a>
              </NextLink>
            </li>
            <li>
              <a
                href="#"
                className="block rounded py-2 pr-4 pl-3 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:p-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-white"
              >
                Services
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block rounded py-2 pr-4 pl-3 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:p-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-white"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
