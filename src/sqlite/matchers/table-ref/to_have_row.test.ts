import { describe, expect } from "vitest";

import { table } from "~sqlite-better-sqlite-3";
import { dbTest } from "~test/text-contexts/better-sqlite-3.ts";

import { toHaveRow } from "./to_have_row.ts";

expect.extend({ toHaveRow });

describe("toHaveRow", () => {
  dbTest.beforeEach(({ dbClient }) => {
    dbClient.exec(`
      CREATE TABLE posts (title TEXT, author TEXT);
      INSERT INTO posts VALUES
        ('First Post', 'alice'),
        ('Second Post', 'bob');
    `);
  });

  dbTest("passes when a row matches an object condition", ({ db }) => {
    expect(table(db, "posts")).toHaveRow({ author: "alice" });
  });

  dbTest("passes when a row matches a SQL condition", ({ db }) => {
    expect(table(db, "posts")).toHaveRow({ sql: "title = ?", params: ["Second Post"] });
  });

  dbTest("fails when no row matches the condition", ({ db }) => {
    expect(table(db, "posts")).not.toHaveRow({ author: "carol" });
  });
});
