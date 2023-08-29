import type { DCMessage, OpenAIMessage } from '../types'
import { encoding_for_model } from '@dqbd/tiktoken'
import { CURVA_API_KEY } from '../constants'

function dcToOpenAIMessages (messages: DCMessage[], clientId: string): OpenAIMessage[] {
  return messages.map((m) => ({
    role: `${m.user}${m.uid === clientId ? '' : ' (You)'}`,
    content: m.content
  }))
}

function _messagesToContext (messages: OpenAIMessage[]) {
  return messages.map((m) => {
    return `${m.role}:\n${m.content}`
  }).join('\n\n')
}

const gpt4Tiktoken = encoding_for_model('gpt-4')
function countTokensLength (text: string): number {
  return gpt4Tiktoken.encode(text).length
}

function messagesToContext (messages: OpenAIMessage[], maxToken = 4000): string {
  messages = [...messages]
  const countedMessages = messages.map((m) => ({ tokens: countTokensLength(m.content) + 10, ...m }))
  while (countedMessages.map(m => m.tokens).reduce((a, b) => a + b, 0) > maxToken) {
    countedMessages.shift()
  }
  return _messagesToContext(countedMessages.map(m => ({ role: m.role, content: m.content })))
}

function dcMessagesToContext (messages: DCMessage[], clientId: string, maxToken = 4000): string {
  return messagesToContext(dcToOpenAIMessages(messages, clientId), maxToken)
}

async function askWithCurva(modelName = 'gpt4_t05_4k', question = 'Hi', context = '') {
  question = question.trim();
  context = context.trim();
  const res = await fetch('https://cch137.link/api/curva/express', {
    method: 'POST',
    body: JSON.stringify({ key: CURVA_API_KEY, modelName, question, context })
  });
  const { answer, error } = await res.json() as { answer: string, error: string }
  if (error) throw error
  return answer
}

export {
  countTokensLength,
  dcToOpenAIMessages,
  messagesToContext,
  dcMessagesToContext,
  askWithCurva,
} 
