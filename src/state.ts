import { atom } from "jotai";

export const inRomAtom = atom<{ name: string; file: Uint8Array }>({
  name: "",
  file: new Uint8Array(),
});
export const screenAtom = atom<
  "uploadScreen" | "patchScreen" | "unsupportedScreen"
>("uploadScreen");
