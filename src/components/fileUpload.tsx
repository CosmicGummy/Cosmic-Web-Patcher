import React from "react";
import Button, { ButtonProps } from "@mui/material/Button";
import { styled } from "@mui/material/styles";

const HiddenUpload = styled("input")({
  display: "none",
});

type Props = {
  id: string;
  label: string;
  onUpload: (args: { name: string; file: Uint8Array }) => void;
} & Omit<ButtonProps, "component">;

export function FileUpload({ id, label, onUpload, ...buttonProps }: Props) {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        const uint8Array = new Uint8Array(arrayBuffer);
        onUpload({ name: file.name, file: uint8Array });
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <>
      <HiddenUpload id={id} type="file" onChange={handleFileUpload} />
      <label htmlFor={id}>
        <Button component="span" {...buttonProps}>
          {label}
        </Button>
      </label>
    </>
  );
}
