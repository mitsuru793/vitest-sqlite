import { describe, expect } from "vitest";

import { table } from "~sqlite-better-sqlite-3";
import { dbTest } from "~test/text-contexts/better-sqlite-3.ts";

import { toHaveRowCount } from "./to_have_row_count.ts";

expect.extend({ toHaveRowCount });

describe("toHaveRowCount", () => {
  dbTest.beforeEach(({ dbClient }) => {
    dbClient.exec(`
      CREATE TABLE posts (title TEXT, author TEXT);
      INSERT INTO posts VALUES
        ('First Post', 'alice'),
        ('Second Post', 'bob'),
        ('Third Post', 'alice');
    `);
  });

  dbTest("error messages", ({ db }) => {
    expect(() => {
      expect(table(db, "posts")).toHaveRowCount(1, { author: "alice" });
    }).toThrowErrorMatchingInlineSnapshot(
      `[Error: expected table "posts" to have 1 rows matching {"author":"alice"}, but it has 2]`,
    );

    expect(() => {
      expect(table(db, "posts")).not.toHaveRowCount(2, { author: "alice" });
    }).toThrowErrorMatchingInlineSnapshot(
      `[Error: expected table "posts" not to have 2 rows matching {"author":"alice"}]`,
    );

    expect(() => {
      expect(table(db, "posts")).toHaveRowCount(1, { sql: "author = 'noname'" });
    }).toThrowErrorMatchingInlineSnapshot(
      `[Error: expected table "posts" to have 1 rows matching {"sql":"author = 'noname'"}, but it has 0]`,
    );

    expect(() => {
      expect(table(db, "posts")).toHaveRowCount(1, { sql: "author = ?", params: ["noname"] });
    }).toThrowErrorMatchingInlineSnapshot(
      `[Error: expected table "posts" to have 1 rows matching {"sql":"author = ?","params":["noname"]}, but it has 0]`,
    );
  });

  dbTest("passes when the matching row count equals the expected count", ({ db }) => {
    expect(table(db, "posts")).toHaveRowCount(2, { author: "alice" });
  });

  dbTest("passes when the total row count equals the expected count", ({ db }) => {
    expect(table(db, "posts")).toHaveRowCount(3);
  });

  dbTest("fails when the total row count differs from the expected count", ({ db }) => {
    expect(table(db, "posts")).not.toHaveRowCount(4);
  });

  dbTest("fails when the matching row count differs from the expected count", ({ db }) => {
    expect(table(db, "posts")).not.toHaveRowCount(1, { author: "noname" });
  });

  describe("SQL conditions", () => {
    dbTest("passes when the SQL matching row count equals the expected count", ({ db }) => {
      expect(table(db, "posts")).toHaveRowCount(2, { sql: "author = ?", params: ["alice"] });
    });

    dbTest("fails when the SQL matching row count differs from the expected count", ({ db }) => {
      expect(table(db, "posts")).not.toHaveRowCount(1, { sql: "author = ?", params: ["alice"] });
    });

    dbTest("passes when no rows match the SQL condition and the expected count is 0", ({ db }) => {
      expect(table(db, "posts")).toHaveRowCount(0, { sql: "author = ?", params: ["noname"] });
    });

    dbTest("passes when the SQL condition has no parameters", ({ db }) => {
      expect(table(db, "posts")).toHaveRowCount(1, { sql: "author = 'bob'" });
    });
  });

  describe("empty table", () => {
    dbTest.beforeEach(({ dbClient }) => {
      dbClient.exec(`
        CREATE TABLE empty_table (title TEXT);
      `);
    });

    dbTest("passes when the table is empty and the expected count is 0", ({ db }) => {
      expect(table(db, "empty_table")).toHaveRowCount(0);
    });

    dbTest("fails when the table is empty but the expected count is not 0", ({ db }) => {
      expect(table(db, "empty_table")).not.toHaveRowCount(1);
    });
  });
});
