import { describe, expect } from "vitest";

import { dbTest } from "~test/text-contexts/better-sqlite-3.ts";
import { table } from "~sqlite-better-sqlite-3";

import { toBeEmptyTable } from "./to_be_empty_table.ts";

expect.extend({ toBeEmptyTable });

describe("toBeEmptyTable", () => {
  dbTest.beforeEach(({ dbClient }) => {
    dbClient.exec("CREATE TABLE posts (title TEXT)");
  });

  dbTest("error messages", ({ db, dbClient }) => {
    expect(() => {
      expect(table(db, "posts")).not.toBeEmptyTable();
    }).toThrowErrorMatchingInlineSnapshot(`[Error: expected table "posts" not to be empty]`);

    dbClient.prepare("INSERT INTO posts VALUES ('First Post')").run();

    expect(() => {
      expect(table(db, "posts")).toBeEmptyTable();
    }).toThrowErrorMatchingInlineSnapshot(
      `[Error: expected table "posts" to be empty, but it has 1 rows]`,
    );
  });

  dbTest("passes when the table has no rows", ({ db }) => {
    expect(table(db, "posts")).toBeEmptyTable();
  });

  dbTest("fails with the row count when the table is not empty", ({ db, dbClient }) => {
    dbClient.prepare("INSERT INTO posts VALUES ('First Post')").run();

    expect(table(db, "posts")).not.toBeEmptyTable();
  });
});
