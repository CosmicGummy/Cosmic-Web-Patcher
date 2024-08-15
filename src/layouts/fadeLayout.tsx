import React from "react";
import Box from "@mui/material/Box";
import { FadingBox } from "../components/fadingBox";

type Props = {
  children: React.ReactNode;
  visible: boolean;
  verticalCenter?: boolean;
  setVisible: (visible: boolean) => void;
  onVisible?: () => void;
  onInvisible?: () => void;
};

export function FadeLayout({
  children,
  visible,
  verticalCenter,
  setVisible,
  onInvisible,
  onVisible,
}: Props) {
  const fadedIn = React.useRef(false);

  React.useEffect(() => {
    if (fadedIn.current) {
      return () => {};
    }

    const timer = setTimeout(() => {
      setVisible(true);
      fadedIn.current = true;
    }, 500);
    return () => clearTimeout(timer);
  }, [setVisible]);

  return (
    <FadingBox
      visible={visible}
      onVisible={onVisible}
      onInvisible={onInvisible}
    >
      <Box display="flex" justifyContent="center" height="100%" p={3}>
        <Box
          display="flex"
          alignContent="center"
          flexDirection="column"
          textAlign="center"
          justifyContent={verticalCenter ? "center" : "flex-start"}
          width="100%"
          height="100%"
          maxWidth={1200}
        >
          {children}
        </Box>
      </Box>
    </FadingBox>
  );
}
