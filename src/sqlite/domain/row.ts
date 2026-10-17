import { type } from "arktype";
import { bindParse } from "~arktype-helper";

export type Row = typeof schema.inferOut;
export type Type = Row;

export type RowValue = typeof RowValue.inferOut;

export const RowValue = type("null | string | number");

export const schema = type({
  "[string]": RowValue,
});

export const parse = bindParse({ schema, name: "Row" });
