import Head from "next/head";
import useAccount from "../../hooks/useAccount";

function Auth({ children }: { children: JSX.Element }) {
  const { isLoading, data: account } = useAccount();

  if (isLoading) {
    return (
      <div className="mx-auto mt-20 min-h-screen w-full rounded-md border-2">
        <div className="flex min-h-screen animate-pulse flex-row items-center justify-center space-x-5">
          <div className="rounded-50 min-h-screen w-full bg-gray-300 "></div>
        </div>
      </div>
    );
  }

  if (account) {
    return children;
  } else {
    return (
      <>
        <Head>
          <title>Error Unauthorized</title>
          <meta
            name="description"
            content="Created by Jimmy Rousseau @lifeofcoding"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
          Please sign in.
        </main>
      </>
    );
  }
}

export default Auth;
