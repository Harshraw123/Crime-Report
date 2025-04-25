import {
  integer,
  pgTable,
  varchar,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";




export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),

});


export const adminTable = pgTable("admin", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
 

});

// // 🔹 Reports Table
export const reportsTable = pgTable("reports", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),

  incidentType: varchar(),
  location: varchar(),
  report: varchar(),


  reportType: varchar('reportType') ,
  status: varchar('status'),

  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),

  userId: integer().notNull().references(() => usersTable.id),
  reportUid:varchar(),
  imgUrl: varchar(),

});
