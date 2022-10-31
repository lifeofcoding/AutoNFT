import "../styles/globals.css";
import Layout from "../components/layout/Main";
import Auth from "../components/layout/Auth";
import { AnimatePresence, motion } from "framer-motion";
import { AppProps } from "next/app";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "../components/Store";

const variants = {
  hidden: { opacity: 0, x: 0, y: 20 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: -0, y: 20 },
};

const MyApp = ({
  Component,
  pageProps,
  router,
}: AppProps<{ requiresLogin?: boolean }>) => {
  const queryClient = new QueryClient();
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Provider>
          <Layout router={router}>
            <AnimatePresence
              exitBeforeEnter
              initial={true}
              onExitComplete={() => {
                if (typeof window !== "undefined") {
                  window.scrollTo({ top: 0 });
                  // document?.querySelector("#page-viewport")?.scrollTo({ top: 0 });
                }
              }}
            >
              <motion.article
                initial="hidden"
                animate="enter"
                exit="exit"
                variants={variants}
                transition={{ duration: 0.4, type: "easeInOut" }}
                key={router.route}
              >
                {pageProps.hasOwnProperty("requiresLogin") ? (
                  <Auth>
                    <Component {...pageProps} />
                  </Auth>
                ) : (
                  <Component {...pageProps} />
                )}
              </motion.article>
            </AnimatePresence>
          </Layout>
        </Provider>
      </QueryClientProvider>
    </>
  );
};

export default MyApp;
