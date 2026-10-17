import { describe, expect } from "vitest";

import { dbTest } from "~test/text-contexts/better-sqlite-3.ts";

import { toHaveTable } from "./to_have_table.ts";

expect.extend({ toHaveTable });

describe("toHaveTable", () => {
  dbTest.beforeEach(({ dbClient }) => {
    dbClient.exec("CREATE TABLE posts (title TEXT)");
  });

  dbTest("error messages", ({ db }) => {
    expect(() => {
      expect(db).not.toHaveTable("posts");
    }).toThrowErrorMatchingInlineSnapshot(`[Error: expected table "posts" not to exist]`);

    expect(() => {
      expect(db).toHaveTable("missing");
    }).toThrowErrorMatchingInlineSnapshot(`[Error: expected table "missing" to exist]`);
  });

  dbTest("passes when the database has the requested table", ({ db }) => {
    expect(db).toHaveTable("posts");
  });

  dbTest("fails when the database does not have the requested table", ({ db }) => {
    expect(db).not.toHaveTable("missing");
  });
});
