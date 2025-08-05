import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  avatar: text("avatar").notNull(), // 'boy' or 'girl'
  displayName: text("display_name").notNull(),
});

export const progressData = pgTable("progress_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  subject: text("subject").notNull(), // 'physics', 'chemistry', 'mathematics'
  topicProgress: jsonb("topic_progress").$type<Record<string, boolean>>().notNull().default({}),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const dailyStudy = pgTable("daily_study", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  studyPlan: text("study_plan").notNull(),
  date: text("date").notNull(), // YYYY-MM-DD format
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  avatar: true,
  displayName: true,
});

export const insertProgressDataSchema = createInsertSchema(progressData).pick({
  userId: true,
  subject: true,
  topicProgress: true,
});

export const insertDailyStudySchema = createInsertSchema(dailyStudy).pick({
  userId: true,
  studyPlan: true,
  date: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertProgressData = z.infer<typeof insertProgressDataSchema>;
export type ProgressData = typeof progressData.$inferSelect;
export type InsertDailyStudy = z.infer<typeof insertDailyStudySchema>;
export type DailyStudy = typeof dailyStudy.$inferSelect;
