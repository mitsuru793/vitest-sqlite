import { describe, expect } from "vitest";

import { table } from "~sqlite-better-sqlite-3";
import { dbTest } from "~test/text-contexts/better-sqlite-3.ts";

import { toHaveColumn } from "./to_have_column.ts";

expect.extend({ toHaveColumn });

describe("toHaveColumn", () => {
  dbTest.beforeEach(({ dbClient }) => {
    dbClient.exec("CREATE TABLE posts (title TEXT, views INTEGER)");
  });

  dbTest("error messages", ({ db }) => {
    expect(() => {
      expect(table(db, "posts")).not.toHaveColumn("title");
    }).toThrowErrorMatchingInlineSnapshot(
      `[Error: expected table "posts" not to have column "title"]`,
    );

    expect(() => {
      expect(table(db, "posts")).not.toHaveColumn("title", { type: "TEXT" });
    }).toThrowErrorMatchingInlineSnapshot(
      `[Error: expected table "posts" not to have column "title" of type TEXT]`,
    );
  });

  dbTest("passes when the table has the requested column", ({ db }) => {
    expect(table(db, "posts")).toHaveColumn("title");
    expect(table(db, "posts")).toHaveColumn("title", { type: "TEXT" });
  });

  dbTest("fails when the table does not have the requested column", ({ db }) => {
    expect(table(db, "posts")).not.toHaveColumn("missing");
  });

  dbTest("checks column types correctly", ({ db, dbClient }) => {
    const COLUMN_TYPES = ["TEXT", "INTEGER", "REAL", "BLOB"] as const;

    dbClient.exec(`
      CREATE TABLE my_table (
        text_col TEXT,
        integer_col INTEGER,
        real_col REAL,
        blob_col BLOB,
        null_col NULL
      )`);

    expect(table(db, "my_table")).toHaveColumn("text_col", { type: "TEXT" });
    for (const type of COLUMN_TYPES) {
      if (type !== "TEXT") {
        expect(table(db, "my_table")).not.toHaveColumn("text_col", { type });
      }
    }

    expect(table(db, "my_table")).toHaveColumn("integer_col", { type: "INTEGER" });
    for (const type of COLUMN_TYPES) {
      if (type !== "INTEGER") {
        expect(table(db, "my_table")).not.toHaveColumn("integer_col", { type });
      }
    }

    expect(table(db, "my_table")).toHaveColumn("real_col", { type: "REAL" });
    for (const type of COLUMN_TYPES) {
      if (type !== "REAL") {
        expect(table(db, "my_table")).not.toHaveColumn("real_col", { type });
      }
    }

    expect(table(db, "my_table")).toHaveColumn("blob_col", { type: "BLOB" });
    for (const type of COLUMN_TYPES) {
      if (type !== "BLOB") {
        expect(table(db, "my_table")).not.toHaveColumn("blob_col", { type });
      }
    }
  });
});
