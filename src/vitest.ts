import { expect } from "vitest";
import type { DbAdapter, SqliteColumnType, TableRef, Where } from "~sqlite";
import * as matchers from "./sqlite/matchers/index.ts";

expect.extend(matchers);

export interface DbAdapterMatchers<R, T> {
  /** expect(db).toHaveTable('users') */
  toHaveTable: T extends DbAdapter.Type ? (name: string) => R : never;
}

export interface TableRefMatchers<R, T> {
  /** expect(table(db, 'users')).toHaveColumn('name', { type: 'TEXT' }) */
  toHaveColumn: T extends TableRef.Type
    ? (
        name: string,
        opts?: {
          type?: SqliteColumnType.Type;
          notNull?: boolean;
        },
      ) => R
    : never;

  /** expect(table(db, 'users')).toHaveRow({ role: 'admin' }) or ({ sql: 'age > ?', params: [20] }) */
  toHaveRow: T extends TableRef.Type ? (where: Where.Type) => R : never;

  toHaveRowCount: T extends TableRef.Type ? (expected: number, where?: Where.Type) => R : never;

  toBeEmptyTable: T extends TableRef.Type ? () => R : never;
}

declare module "vitest" {
  interface Matchers<R, T> extends DbAdapterMatchers<R, T>, TableRefMatchers<R, T> {}
}
