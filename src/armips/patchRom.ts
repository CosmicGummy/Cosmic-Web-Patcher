import { runArmips, Replacements, ArmipsOut } from "./runArmips";

type PatchRomArgs = {
  rom: Uint8Array;
  outFileName: string;
  replacements: Replacements;
  files: Record<string, string>;
};

export function patchRom({
  rom,
  outFileName,
  replacements,
  files,
}: PatchRomArgs): Promise<ArmipsOut> {
  const entryFileName = "main.s";
  const entryFile = `.gba
  .open "in.bin", "${outFileName}", 0x00

  ${Object.keys(files)
    .map((patch) => `.include "${patch}"`)
    .join("\n")}

  .close`;

  return runArmips({
    entryFileName,
    replacements,
    files: {
      ...files,
      [entryFileName]: entryFile,
      "in.bin": rom,
    },
  });
}
