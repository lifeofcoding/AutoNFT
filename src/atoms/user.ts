import { atom } from "jotai";
import { User } from "firebase/auth";

export const userAtom = atom<{ isLoggedIn: boolean; user?: User }>({
  isLoggedIn: false,
});
