import { AutocompleteInputChangeReason, IconButtonProps } from "@mui/material";
import { SyntheticEvent } from "react";

export type ChoiceItems = {
  text: string;
  value: string;
};

export interface SimpleField {
  label: string | React.ReactNode;
  fieldId?: string;
  shrink?: boolean;
}

export interface CheckboxField extends SimpleField {
  checked?: boolean;
  size?: number;
}

export interface ChoiceField extends SimpleField {
  items: ChoiceItems[];
}

export type Option = { label: string; id: number };

export interface AutoCompleteFieldOpts {
  items: Option[];
  inputLabel: string;
  noOptionsText: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChangeExtraProcessing?: (value?: any) => void;
  handleOnInputChange?: (
    event: SyntheticEvent<Element, Event>,
    value: string,
    reason: AutocompleteInputChangeReason
  ) => void | undefined;
  fieldId?: string;
  required?: boolean;
  checkbox?: boolean;
}

enum FileType {
  "IMAGE" = "image/*",
  "AUDIO" = "audio/*",
  "VIDEO" = "video/*",
  "PNG" = ".png",
  "JPG" = ".jpg",
  "JPEG" = ".jpeg",
  "PDF" = ".pdf",
  "EXCEL" = ".xsl, .xslx",
  "WORD" = ".doc, .docx",
}

export interface FileField extends SimpleField {
  placeholder?: string;
  fileTypes?: FileType[];
  iconButton?: IconButtonProps;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue: any;
}
