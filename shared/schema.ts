import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";

// Example schema - can be extended based on application needs
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const bellConfigurations = pgTable("bell_configurations", {
  id: serial("id").primaryKey(),
  userId: text("user_id"),
  bellType: text("bell_type").notNull(),
  timeZone: text("time_zone").notNull(),
  startTime: text("start_time"),
  endTime: text("end_time"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
