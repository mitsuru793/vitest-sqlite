import { type } from "arktype";
import { bindParse } from "~arktype-helper";

export type ColumnInfo = typeof schema.inferOut;
export type Type = ColumnInfo;

export const schema = type({
  name: "string > 0",

  // empty string means no type specified
  type: "string",

  notNull: "boolean",
  primaryKey: "boolean",
  foreignKey: type({
    table: "string > 0",
    column: "string > 0",
  }).or("boolean"),
  unique: "boolean",
});

export const parse = bindParse({ schema, name: "ColumnInfo" });
