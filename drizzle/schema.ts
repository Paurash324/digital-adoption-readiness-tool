import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * One row per completed readiness check-in. Answers and category scores are
 * stored as JSON strings so the public quiz can be analyzed without requiring
 * an account or putting private business details in the database.
 */
export const readinessSubmissions = mysqlTable("readinessSubmissions", {
  id: int("id").autoincrement().primaryKey(),
  language: varchar("language", { length: 8 }).notNull(),
  answersJson: text("answersJson").notNull(),
  categoryScoresJson: text("categoryScoresJson").notNull(),
  totalScore: int("totalScore").notNull(),
  maxScore: int("maxScore").notNull(),
  percent: int("percent").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ReadinessSubmission = typeof readinessSubmissions.$inferSelect;
export type InsertReadinessSubmission = typeof readinessSubmissions.$inferInsert;
