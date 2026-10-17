import { type } from "arktype";
import { bindParse } from "~arktype-helper";

export type ColumnInfo = typeof schema.inferOut;
export type Type = ColumnInfo;

export const schema = type({
  name: "string",
  type: "string",
  notNull: "boolean",
  primaryKey: "boolean",
});

export const parse = bindParse({ schema, name: "ColumnInfo" });
