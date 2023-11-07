// import { eq } from 'drizzle-orm'

export default eventHandler(async (event) => {
  // List todos for the current user
  const todos = await useDb().select().from(tables.article).all()

  return todos
})
