import React from "react";
import Typography from "@mui/material/Typography";
import { FileUpload } from "../components/fileUpload";
import { useAtom } from "jotai";
import { screenAtom, inRomAtom } from "../state";
import { detectRom } from "../utils/detectRom";
import { match } from "ts-pattern";
import { FadeLayout } from "../layouts/fadeLayout";

export function UploadScreen() {
  const [inRom, setInRom] = useAtom(inRomAtom);
  const [, setScreen] = useAtom(screenAtom);
  const [visible, setVisible] = React.useState(false);

  const romType = inRom.file.length === 0 ? null : detectRom(inRom.file);

  return (
    <FadeLayout
      visible={visible}
      setVisible={setVisible}
      verticalCenter
      onInvisible={() => {
        match(romType)
          .with(null, () => {})
          .with("unsupported", () => setScreen("unsupportedScreen"))
          .otherwise(() => setScreen("patchScreen"));
      }}
    >
      <FileUpload
        id="file-upload"
        fullWidth
        onUpload={({ name, file }) => {
          setInRom({ name, file });
          setVisible(false);
        }}
      />

      <Typography mt={4} variant="subtitle2" color="GrayText">
        Currently only Pokemon Emerald (US) is supported.
      </Typography>
    </FadeLayout>
  );
}
