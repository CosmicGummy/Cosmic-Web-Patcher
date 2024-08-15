import { init, runWasix, Directory, type Output } from "@wasmer/sdk/bundled";
import { match } from "ts-pattern";
import armipsWasm from "./armips.wasm?url";

const wasmInit = init(undefined);
const armipsPromise = fetch(armipsWasm)
  .then((res) => res.arrayBuffer())
  .then((buf) => new Uint8Array(buf));

function getArgType(value: string | number) {
  return typeof value === "string" ? "string" : "number";
}

function formatReplacementsAsArgs(replacements: Replacements) {
  const names = Object.keys(replacements);
  const values = Object.values(replacements);

  return names.flatMap((name, index) => {
    const value = values[index];
    const { flag, parsedValue } = match(getArgType(value))
      .with("number", () => ({ flag: "-equ", parsedValue: value.toString() }))
      .with("string", () => ({ flag: "-strequ", parsedValue: `"${value}"` }))
      .exhaustive();

    return [flag, name, parsedValue];
  });
}

export type Replacements = Record<string, string | number>;

type ArmipsArgs = {
  entryFileName: string;
  files: Record<string, string | Uint8Array>;
  replacements?: Replacements;
};

export type ArmipsOut = {
  res: Output;
  outFiles: Record<string, Uint8Array>;
};

export async function runArmips({
  entryFileName,
  replacements,
  files,
}: ArmipsArgs): Promise<ArmipsOut> {
  await wasmInit;
  const armips = await armipsPromise;

  const appDir = new Directory(files);

  const replacementArgs = formatReplacementsAsArgs(replacements ?? {});
  const instance = await runWasix(armips, {
    args: ["-root", "/app", entryFileName, ...replacementArgs],
    mount: { "/app": appDir },
  });
  const res = await instance.wait();
  const outFiles: Record<string, Uint8Array> = {};

  const appDirFiles = await appDir.readDir(".");
  for (let i = 0; i < appDirFiles.length; i++) {
    const appDirFile = appDirFiles[i];
    if (appDirFile.type === "file") {
      const appDirFileName = appDirFile.name;
      outFiles[appDirFileName] = await appDir.readFile(appDirFileName);
    }
  }

  return { res, outFiles };
}
