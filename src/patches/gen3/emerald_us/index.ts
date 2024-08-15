import { randomSpeciesIndex } from "../../../utils/dexUtils";
import { PatchFactory, type Patch } from "../../types";

import obedient from "./obedient.s?raw";
import starter from "./starter.s?raw";
import instantRunningShoes from "./instantRunningShoes.s?raw";
import runIndoors from "./runIndoors.s?raw";
import fastestText from "./fastestText.s?raw";
import setRandomEncounters from "./setRandomEncounters.s?raw";

function setRandomEncountersPatch(): Patch {
  const replacements: Record<string, number> = {};
  for (let i = 0; i < 1975; i++) {
    replacements[`POKEMON_${i}`] = randomSpeciesIndex();
  }

  return {
    name: "setRandomEncounters",
    patch: setRandomEncounters,
    replacements,
  };
}

function fastestTextPatch(): Patch {
  return { name: "fastestText", patch: fastestText };
}

function instantRunningShoesPatch(): Patch {
  return { name: "instantRunningShoes", patch: instantRunningShoes };
}

function runIndoorsPatch(): Patch {
  return { name: "runIndoors", patch: runIndoors };
}

function obediencePatch(): Patch {
  return { name: "obedient", patch: obedient };
}

function randomStarterPatch(): Patch {
  return {
    name: "starter",
    patch: starter,
    replacements: {
      STARTER_1: randomSpeciesIndex(),
      STARTER_2: randomSpeciesIndex(),
      STARTER_3: randomSpeciesIndex(),
    },
  };
}

export const patches: PatchFactory[] = [
  {
    label: "Random starters",
    factory: () => [obediencePatch(), randomStarterPatch()],
  },
  {
    label: "Run indoors",
    factory: () => [runIndoorsPatch()],
  },
  {
    label: "Instant running shoes",
    factory: () => [instantRunningShoesPatch()],
  },
  { label: "Fastest text", factory: () => [fastestTextPatch()] },
  {
    label: "Set random encounters",
    factory: () => [setRandomEncountersPatch()],
  },
];
