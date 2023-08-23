import { config as dotenvConfig } from 'dotenv'
import MindsDB from 'mindsdb-js-sdk'
import type { DCMessage, OpenAIMessage } from './types'
import { encoding_for_model } from '@dqbd/tiktoken'

dotenvConfig()

const connection = (async () => {
  await MindsDB.connect({
    user: process.env.MINDSDB_EMAIL || '',
    password: process.env.MINDSDB_PASSWD || ''
  })
  return MindsDB
})()

function stringEscape (text = ''): string {
  const singleQInText = text.includes('\'')
  const doubleQInText = text.includes('\"')
  if (doubleQInText && singleQInText) {
    return `"${text.replace(new RegExp('\"', 'g'), '\'')}"`
  }
  if (singleQInText) {
    return `"${text}"`
  }
  return `'${text}'`
}

async function askGPT (modelName = 'gpt4_t05_4k', question = '', context = '') {
  const model = await (await connection).Models.getModel(modelName, 'mindsdb')
  return (await model!.query({
    where: [`question=${stringEscape(question)}`, `context=${stringEscape(context)}`]
  })).value as string
}

function dcToOpenAIMessages (messages: DCMessage[], clientId: string): OpenAIMessage[] {
  return messages.map((m) => ({
    role: m.uid === clientId ? 'assistant' : `@${m.user}`,
    content: m.content
  }))
}

function _messagesToContext (messages: OpenAIMessage[]) {
  return messages.map((m) => {
    return `${m.role}:\n${m.content}`
  }).join('\n\n')
}
function countTokensLength (text: string): number {
  return encoding_for_model('gpt-4').encode(text).length
}
function messagesToContext (messages: OpenAIMessage[], maxToken = 4000): string {
  messages = [...messages]
  let context = _messagesToContext(messages)
  while (countTokensLength(context) > maxToken) {
    messages.shift()
    context = _messagesToContext(messages)
  }
  return context
}

function dcMessagesToContext (messages: DCMessage[], clientId: string, maxToken = 4000): string {
  return messagesToContext(dcToOpenAIMessages(messages, clientId), maxToken)
}

export {
  countTokensLength,
  dcToOpenAIMessages,
  messagesToContext,
  dcMessagesToContext,
}
export default askGPT  
