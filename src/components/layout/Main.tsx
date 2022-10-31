import { NextRouter } from "next/router";
import Navbar from "./Navbar";
import Alerts from "./Alerts";
import Background from "./Background";

function Main({
  children,
  router,
}: {
  children: React.ReactNode;
  router: NextRouter;
}) {
  return (
    <>
      <Navbar path={router.asPath} />
      <Background />
      <div className="mt-10">{children}</div>
      <Alerts />
    </>
  );
}

export default Main;
