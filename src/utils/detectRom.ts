import { match } from "ts-pattern";

type RomType = "unsupported" | "Pokemon Emerald (US)";

export function detectRom(rom: Uint8Array): RomType {
  const romId = new TextDecoder().decode(rom.slice(0xa0, 0xb0));
  return match<string, RomType>(romId)
    .with("POKEMON EMERBPEE", () => "Pokemon Emerald (US)")
    .otherwise(() => "unsupported");
}
