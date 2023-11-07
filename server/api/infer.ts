export default eventHandler(async (event) => {
  const ACCOUNT_ID = process.env.ACCOUNT_ID
  const TOKEN = process.env.CF_TOKEN
  const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/@cf/meta/llama-2-7b-chat-int8`

  const messages = [
    {
      role: 'system',
      content: 'You reply in only one sentence.',
    },
    { role: 'user', content: 'What is the origin of the phrase Hello, World' },
  ]

  const response = $fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
    },
    body: { messages },
  })
  return response
})
