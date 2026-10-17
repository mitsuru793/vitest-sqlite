const all = ["TEXT", "INTEGER", "REAL", "BLOB"] as const;

export type Type = (typeof all)[number];
