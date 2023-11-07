import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const article = sqliteTable('article', {
  id: integer('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
})