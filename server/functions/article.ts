import type { H3Event } from 'h3'
import { Ref } from 'vue'

const article = tables.article
const db = useDb()

export async function createArticle(
  this: H3Event,
  arg: { title: string; content: string }
) {
  await db.insert(article).values({
    title: arg.title,
    content: arg.content,
    createdAt: new Date(),
  })
  return { hello: 'world' }
}
