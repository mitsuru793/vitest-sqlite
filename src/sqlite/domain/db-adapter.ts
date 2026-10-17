import { type } from "arktype";
import { bindParse } from "~arktype-helper";
import * as ColumnInfo from "./column-info.ts";
import * as Where from "./where.ts";
import type { Row } from "./row.ts";

export type DbAdapter = typeof schema.inferOut;
export type Type = DbAdapter;

export const schema = type({
  tableExists: type("Function")
    .pipe(type.fn("string", ":", "boolean"))
    .as<(table: string) => boolean>(),

  getColumns: type("Function")
    .pipe(type.fn("string", ":", ColumnInfo.schema.array()))
    .as<(table: string) => ColumnInfo.Type[]>(),

  count: type("Function")
    .pipe(type.fn("string", Where.schema.optional(), ":", "number"))
    .as<(table: string, where?: Where.Type) => number>(),

  findRows: type("Function")
    .pipe(type.fn("string", Where.schema.optional(), ":", "number"))
    .as<(table: string, where?: Where.Type) => Row[]>(),
});

export function isDbAdapter(value: unknown): value is Type {
  return schema.allows(value);
}

export const parse = bindParse({ schema, name: "DbAdapter" });
