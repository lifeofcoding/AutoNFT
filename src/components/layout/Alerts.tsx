import { useAtomValue, useSetAtom } from "jotai";
import { atomWithReducer } from "jotai/utils";
import { useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Alert = {
  type: "error" | "success";
  message: string;
};

type Action = {
  type: "push" | "pop";
  value?: Alert;
};

function truncate(str: string, n: number, useWordBoundary: boolean) {
  if (str.length <= n) {
    return str;
  }
  const subString = str.slice(0, n - 1); // the original check
  return (
    (useWordBoundary
      ? subString.slice(0, subString.lastIndexOf(" "))
      : subString) + "..."
  );
}

const countReducer = (value: Alert[], action?: Action | undefined) => {
  if (action?.type === "push" && action.value) {
    return [...value, action.value];
  }
  if (action?.type === "pop") {
    value.pop();

    return [...value];
  }

  return value;
  // throw new Error("unknown action type");
};

const countReducerAtom = atomWithReducer<Alert[], Action>([], countReducer);

export const useAlerts = () => {
  const setValue = useSetAtom(countReducerAtom);

  const alertCallback = useCallback(
    (a: Alert) => {
      setValue({ type: "push", value: a });
      setTimeout(() => setValue({ type: "pop" }), 5000);
    },
    [setValue]
  );

  return alertCallback;
};

function Alerts() {
  const alerts = useAtomValue(countReducerAtom);

  return (
    <div className="fixed right-10 bottom-5 flex w-1/4 flex-col gap-5">
      <AnimatePresence>
        {alerts.map((a, idx) => {
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, bottom: -50 }}
              exit={{ opacity: 0, bottom: -50 }}
              animate={{ opacity: 1, bottom: 0 }}
              transition={{ duration: 0.5, type: "spring", bounce: 0.8 }}
              className={`relative rounded border-b border-l border-gray-200 ${
                a.type === "error" ? "bg-red-500" : "bg-blue-500"
              } z-50 bg-opacity-40 p-5 backdrop-blur-lg backdrop-filter`}
            >
              {truncate(a.message, 30, true)}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

export default Alerts;
