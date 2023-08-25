import { config as dotenvConfig } from 'dotenv'
import type { Guild, TextChannel } from 'discord.js'
import { Client, IntentsBitField, EmbedBuilder } from 'discord.js'
import askGPT, { dcMessagesToContext } from './ask-gpt'
import { CURVA_API_KEY } from './constants'

const uidRegex = /<@(\d+)>/g;
function extractUids(message: string): string[] {
  const matches = message.match(uidRegex)
  return matches
    ? matches.map(match => match.replace(/<@|>/g, ''))
    : []
}
function replaceUidToUsername(message: string, userMap: Map<string, string>) {
  extractUids(message).forEach((uid) => {
    message = message.replace(new RegExp(`<@${uid}>`, 'g'), `@${userMap.get(uid) || 'anonymous'}`)
  })
  return message
}

async function getRecentChannelMessages(guild: Guild, channel: TextChannel, replaceWithUsername = true) {
  const messages = await channel.messages.fetch()
  const userIdList = new Set(messages.map((m) => m.author.id))
  for (const m of messages) {
    extractUids(m[1].content).forEach((uid) => userIdList.add(uid))
  }
  if (!replaceWithUsername) {
    return messages.map((message, key) => ({
      createdAt: message.createdTimestamp,
      uid: message.author.id,
      user: message.author.globalName || message.author.displayName || message.author.username,
      content: message.content
    })).filter((m) => m.content.trim()).reverse()
  }
  const users = new Map<string, string>()
  await Promise.all([...userIdList].map(async (id) => {
    const user = await guild.members.fetch({ user: id })
    const { nickname } = user
    const { globalName, displayName, username } = user.user
    users.set(id, nickname || globalName || displayName || username)
  }))
  return messages.map((message, key) => ({
    createdAt: message.createdTimestamp,
    uid: message.author.id,
    user: users.get(message.author.id) || 'anonymous',
    content: replaceUidToUsername(message.content, users)
  })).filter((m) => m.content.trim()).reverse()
}

async function askCurva(modelName = 'gpt4_t05_4k', question = 'Hi', context = '') {
  const res = await fetch('https://cch137.link/api/curva/express', {
    method: 'POST',
    body: JSON.stringify({ key: CURVA_API_KEY, modelName, question, context })
  })
  const { answer, error } = await res.json() as { answer: string, error: string }
  if (error) throw error
  return answer
}

function splitTextToChunks(input: string, maxLength = 2000): string[] {
  const result: string[] = []
  for (let i = 0; i < input.length; i += maxLength) {
    result.push(input.substring(i, i + maxLength))
  }
  return result;
}

export {
  extractUids,
  replaceUidToUsername,
  getRecentChannelMessages,
  askCurva,
  splitTextToChunks
}