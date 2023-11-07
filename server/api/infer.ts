export default eventHandler(async (event) => {
  const ACCOUNT_ID = process.env.ACCOUNT_ID
  const TOKEN = process.env.CF_TOKEN
  const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/@cf/meta/llama-2-7b-chat-int8`
  const response = $fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
    },
    body: {
      prompt: 'Where is Nepal?',
    },
  })
  return response
})
