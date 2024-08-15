import React from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useAtom } from "jotai";
import { screenAtom } from "../state";
import { FadeLayout } from "../layouts/fadeLayout";

export function UnsupportedScreen() {
  const [, setScreen] = useAtom(screenAtom);
  const [visible, setVisible] = React.useState(false);

  return (
    <FadeLayout
      visible={visible}
      setVisible={setVisible}
      onInvisible={() => setScreen("uploadScreen")}
      verticalCenter
    >
      <Typography variant="h4" mb={2}>
        This rom is unsupported at this time.
      </Typography>
      <Typography variant="body1" mb={2}>
        If you'd like to see it supported, please open an issue on GitHub.
      </Typography>
      <Button fullWidth onClick={() => setVisible(false)}>
        Restart
      </Button>
    </FadeLayout>
  );
}
