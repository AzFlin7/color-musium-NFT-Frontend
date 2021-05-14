import React from "react";
import { styled } from "@stitches/react";
import { violet, mauve, blackA, whiteA } from "@radix-ui/colors";
import * as SwitchPrimitive from "@radix-ui/react-switch";

const StyledSwitch = styled(SwitchPrimitive.Root, {
  all: "unset",
  width: 42,
  height: 25,
  backgroundColor: blackA.blackA9,
  borderRadius: "9999px",
  position: "relative",
  border: "4px solid #6A6A6A",
  boxShadow: `0 2px 10px ${blackA.blackA7}`,
  WebkitTapHighlightColor: "rgba(0, 0, 0, 0)",
  boxShadow: `0 0 0 2px black`,
  '&[data-state="checked"]': { backgroundColor: "#000000", borderColor: '#C0C0C0' },
});

const StyledThumb = styled(SwitchPrimitive.Thumb, {
  display: "block",
  width: 21,
  height: 21,
  backgroundColor: "#6A6A6A",
  borderRadius: "9999px",
  boxShadow: `0 2px 2px ${blackA.blackA7}`,
  transition: "transform 100ms",
  transform: "translateX(2px)",
  willChange: "transform",
  '&[data-state="checked"]': {
    transform: "translateX(19px)",
    backgroundColor: "#FFFFFF",
  },
});

export const Switch = StyledSwitch;
export const SwitchThumb = StyledThumb;
