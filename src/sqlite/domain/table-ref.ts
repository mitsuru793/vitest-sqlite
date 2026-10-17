import { type } from "arktype";
import { bindParse } from "~arktype-helper";

import * as DbAdapter from "./db-adapter.ts";

/** Accepts a DbAdapter or a better-sqlite3 Database (e.g. drizzle's `db.$client`). */
export type TableRef = typeof schema.inferOut;
export type Type = TableRef;

export const schema = type({
  __dbTestingTable: "true",
  adapter: DbAdapter.schema,
  name: "string",
});

export const parse = bindParse({
  schema,
  name: "TableRef",
});

export type CreateTableRefFromDbAdapter = (db: DbAdapter.Type, name: string) => TableRef;
