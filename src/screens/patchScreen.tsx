import React from "react";
import ListItemIcon from "@mui/material/ListItemIcon";
import Checkbox from "@mui/material/Checkbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { FadingBox } from "../components/fadingBox";
import { patchRom } from "../armips";
import { useAtom } from "jotai";
import { match, P } from "ts-pattern";
import { inRomAtom } from "../state";
import { emeraldUsPatches, PatchFactory } from "../patches";
import { FadeLayout } from "../layouts/fadeLayout";
import { detectRom } from "../utils/detectRom";

async function applyPatches({
  checked,
  patches,
  inRomFile,
}: {
  checked: Record<string, boolean>;
  patches: PatchFactory[];
  inRomFile: Uint8Array;
}): Promise<
  | {
      error: string;
      patchedRom?: undefined;
    }
  | {
      error?: undefined;
      patchedRom: Uint8Array;
    }
> {
  const selectedPatches = patches.filter((patch) => checked[patch.label]);
  const createdPatches = selectedPatches.flatMap((patch) => patch.factory());

  const selectedFiles = createdPatches.reduce(
    (acc: Record<string, string>, patch) => {
      acc[patch.name] = patch.patch;
      return acc;
    },
    {}
  );

  const replacements = createdPatches.reduce(
    (acc: Record<string, string | number>, patch) => {
      if (patch.replacements != null) {
        return { ...acc, ...patch.replacements };
      }
      return acc;
    },
    {}
  );

  const { res, outFiles } = await patchRom({
    outFileName: "out.bin",
    rom: inRomFile,
    replacements,
    files: selectedFiles,
  });

  return match({ ok: res.ok, outBin: outFiles["out.bin"] })
    .with({ ok: true, outBin: P.not(P.nullish) }, ({ outBin }) => {
      return { patchedRom: outBin };
    })
    .with({ ok: true, outBin: P.nullish }, () => {
      return { error: "Armips did not produce an out.bin file" };
    })
    .with({ ok: false }, () => {
      return { error: `Armips ran into an error: ${res.stdout} ${res.stderr}` };
    })
    .exhaustive();
}

export function PatchScreen() {
  const [inRom] = useAtom(inRomAtom);
  const [error, setError] = React.useState<unknown | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [visible, setVisible] = React.useState(false);
  const [patchedRom, setPatchedRom] = React.useState<Uint8Array | null>(null);
  const [checked, setChecked] = React.useState<Record<string, boolean>>({});

  const romType = detectRom(inRom.file);

  const patches = match(romType)
    .with("Pokemon Emerald (US)", () => emeraldUsPatches)
    .with("unsupported", () => [])
    .exhaustive();

  async function applyPatch() {
    setLoading(true);
    setPatchedRom(null);
    setError(null);
    try {
      const { error, patchedRom } = await applyPatches({
        checked,
        patches,
        inRomFile: inRom.file,
      });
      setError(error);
      setPatchedRom(patchedRom ?? null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <FadeLayout visible={visible} setVisible={setVisible}>
        <Typography variant="h4" mb={2}>
          Patching {romType}
        </Typography>
        <Typography variant="h5">Choose patches to apply</Typography>
        <List>
          {patches.map((patch) => (
            <ListItem dense key={patch.label}>
              <ListItemButton
                onClick={() =>
                  setChecked((currentChecked) => ({
                    ...currentChecked,
                    [patch.label]: !currentChecked[patch.label],
                  }))
                }
                dense
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={checked[patch.label] ?? false}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ "aria-labelledby": patch.label }}
                  />
                </ListItemIcon>
                <ListItemText id={patch.label} primary={patch.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Button onClick={applyPatch} disabled={loading}>
          {loading ? "Applying..." : "Apply patches"}
        </Button>
        <FadingBox visible={patchedRom != null}>
          {patchedRom != null && (
            <Button
              fullWidth
              download={`patched_${inRom.name}`}
              href={
                patchedRom == null
                  ? "#"
                  : URL.createObjectURL(
                      new Blob([patchedRom], {
                        type: "application/octet-stream",
                      })
                    )
              }
            >
              Download patched rom
            </Button>
          )}
        </FadingBox>
      </FadeLayout>
      <Snackbar
        open={error != null}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" variant="filled">{`Error: ${error}`}</Alert>
      </Snackbar>
    </>
  );
}
