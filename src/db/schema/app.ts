
import { integer, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
const timestamps = {
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()).notNull()
}

export const department = pgTable(
    'departments', {
    id: serial('id').primaryKey(),
    code: varchar('code', { length: 50 }).notNull().unique(),
    name: varchar('name', { length: 255 }).notNull(),
    description: varchar('description', { length: 255 }),
    ...timestamps
}
)

export const subjects = pgTable(
    'subjects', {
    id: serial('id').primaryKey(),
    departmentId: integer('department_id').notNull().references(() => department.id, { onDelete: 'restrict' }),
    name: varchar('name', { length: 255 }).notNull(),
    code: varchar('code', { length: 50 }).notNull().unique(),
    description: varchar('description', { length: 255 }),
    ...timestamps
}
)

export const departmentRelations= relations(department, ({ many }) => ({
    subjects: many(subjects)
}))


export const subjectRelations= relations(subjects, ({ one }) => ({
    department: one(department, {
        fields: [subjects.departmentId],
        references: [department.id],
    }),
    // Add other relations if needed
}));

export type Department = typeof department.$inferSelect;
export type NewDepartment = typeof department.$inferInsert;
export type Subject = typeof subjects.$inferSelect;
export type NewSubject = typeof subjects.$inferInsert;
