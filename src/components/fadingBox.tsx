import React from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { once } from "../utils/once";

type FadingBoxStyles = {
  visible: boolean;
  display?: "flex" | "none";
};

const RootFade = styled(Box)(({ visible, display }: FadingBoxStyles) => ({
  display,
  opacity: visible ? 1 : 0,
  transition: `opacity 0.5s ease-in-out`,
  height: "100%",
  width: "100%",
}));

type FadingBoxProps = {
  children: React.ReactNode;
  onVisible?: () => void;
  onInvisible?: () => void;
} & FadingBoxStyles;

export function FadingBox({
  visible,
  children,
  onVisible,
  onInvisible,
}: FadingBoxProps & {
  onVisible?: () => void;
  onInvisible?: () => void;
}) {
  const onTransitionEnd = React.useMemo(() => {
    return once(() => (visible ? onVisible?.() : onInvisible?.()));
  }, [visible, onVisible, onInvisible]);

  return (
    <RootFade visible={visible} onTransitionEnd={onTransitionEnd}>
      {children}
    </RootFade>
  );
}
