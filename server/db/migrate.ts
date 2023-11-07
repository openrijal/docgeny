import path from 'path'
import { fileURLToPath } from 'url'

import { migrate } from 'drizzle-orm/better-sqlite3/migrator'

import { migrate as migrateD1 } from 'drizzle-orm/d1/migrator'

import { drizzle } from 'drizzle-orm/better-sqlite3'
import { drizzle as drizzleD1 } from 'drizzle-orm/d1'
// @ts-ignore
import Database from 'better-sqlite3'
import { join } from 'pathe'

export * as tables from '~/server/db/schema'

// const { dbDir } = useRuntimeConfig()

const __filename = fileURLToPath(import.meta.url)
const dbDir = path.dirname(__filename)

const target = process.argv[2] || 'local'

if (target === 'd1') {
  // d1 in production
  console.log('Running migrations for D1 ...')
  const _db = drizzleD1(process.env.DB)
  migrateD1(_db, { migrationsFolder: join(dbDir, './migrations') })
} else if (target === 'local') {
  // local sqlite in development
  console.log('Running migrations for local database ...')
  const sqlite = new Database(join(dbDir, './db.sqlite'))
  const _db = drizzle(sqlite)
  migrate(_db, { migrationsFolder: join(dbDir, './migrations') })
}
