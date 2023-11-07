export default eventHandler(async (event) => {
  const ACCOUNT_ID = process.env.ACCOUNT_ID
  const TOKEN = process.env.CF_TOKEN
  const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/@cf/meta/llama-2-7b-chat-int8`

  const messages = [
    {
      role: 'system',
      content:
        'You generate cover letter for the user prompt. Do not use placeholders for unknown values.',
    },
    {
      role: 'user',
      content:
        'Name: Dipesh Acharya, Position: Nuxt Developer, Company: Nuxt Labs',
    },
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
