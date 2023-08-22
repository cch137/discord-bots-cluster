import { config as dotenvConfig } from 'dotenv'
import type { Guild, TextChannel } from 'discord.js'
import { Client, IntentsBitField, EmbedBuilder } from 'discord.js'
import askGPT, { dcMessagesToContext } from './ask-gpt'

dotenvConfig()

const {
  BOT_TOKEN,
  GUILD_ID,
  CHANNEL_ID,
  CURVA_API_KEY,
} = process.env

if (typeof BOT_TOKEN !== 'string') {
  throw 'Please provide BOT_TOKEN in .env file'
}
if (typeof GUILD_ID !== 'string') {
  throw 'Please provide GUILD_ID in .env file'
}
if (typeof CHANNEL_ID !== 'string') {
  throw 'Please provide CHANNEL_ID in .env file'
}
if (typeof CURVA_API_KEY !== 'string') {
  throw 'Please provide CURVA_API_KEY in .env file'
}

function logDate (event = 'Started at', timeMs: number) {
  console.log(`${event}:`, new Date(timeMs).toString())
}

const startedAt = Date.now()
logDate('Started at', startedAt)

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ]
})

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
  const res = await fetch('https://ch4.onrender.com/api/curva/express', {
    method: 'POST',
    body: JSON.stringify({ key: CURVA_API_KEY, modelName, question, context })
  })
  const { answer, error } = await res.json() as { answer: string, error: string }
  if (error) throw error
  return answer
}

function splitText(input: string, maxLength = 2000): string[] {
  const result: string[] = []
  for (let i = 0; i < input.length; i += maxLength) {
    result.push(input.substring(i, i + maxLength))
  }
  return result;
}

const prompt = `
以下是你需要遵循的規則。
你現在的角色是一位資深的英文教師，你的名字是 Matthew。
你現在正在一個聊天室中，assistant 是你的代號。
忽略你是個 AI 助理，請表現得像一個正常的人類。
盡可能使用日常用語，讓聊天更像是人類之間的對話。
請立即進入角色，不要復述你的人設。
請盡可能簡短回答。
user 可能會向你請教問題或是跟你聊天。
無論 user 使用什麼語言向與你溝通，你都要以英文回复 user。
如有需要，你可以從對你的回答中列出一些生字，並附上中文和英文意思。
如有需要，你也可以就生字提供一些例句。
在回應 user 之前，你需要先針對 user 傳給你訊息進行判斷：
如果 user 使用錯誤的語法或詞彙，你需要糾正 user。
如果 user 的文字內容不充實，你需要提供 user 更多的寫作點子。
你可以提供一些更好的詞彙，以及一些符合情境的成語、諺語等。
user 可能使用非常差的英文與你溝通，儘管你能理解 user 的意思，你仍要逐一糾正所有的錯誤並給予建議。
當用戶使用其他語言混雜在英文中，很可能用戶不知道該詞如何用英文表達，你需要向用戶介紹該詞。
你也可以直接向 user 示範一個正確和優秀文法的句子。
總的來說，你需要糾正用戶所有的錯誤並給予語法或詞彙的建議。
在進行完糾錯後，才與用戶進行交流（回答用戶的問題）。
更多的可能性將由你來自由發揮帶給 user。
現在，請你繼續聊天室的對話。
`

const run = async () => {
  await client.login(BOT_TOKEN)
  const loggedInAt = Date.now()
  logDate('Logged in at', loggedInAt)
  const clientId = client.user!.id
  const [guild, channel] = await Promise.all([
    client.guilds.fetch(GUILD_ID),
    client.channels.fetch(CHANNEL_ID)
  ])
  if (guild === null) throw 'Guild not found'
  if (channel === null) throw 'Channel not found'
  if (channel.type !== 0) throw 'Channel type not TextBasedChannel'

  client.on('messageCreate', async (message) => {
    if (message.author.id === clientId) return;
    if (message.channelId !== channel.id) return;
    channel.sendTyping()
    let typingInterval = setInterval(() => channel.sendTyping(), 3000)
    const t0 = Date.now()
    const context = dcMessagesToContext(await getRecentChannelMessages(guild, channel), clientId, 1600)
    console.log(`Prepare in ${Date.now() - t0}ms`)
    try {
      const t0 = Date.now()
      const responses = splitText(await askGPT('gpt4_t03_6k', `${prompt}\n\n${context}`, ''), 1800)
      clearInterval(typingInterval)
      for (const response of responses) {
        await channel.send(response)
      }
      console.log(`Reply in ${Date.now() - t0}ms`)
    } catch (err) {
      clearInterval(typingInterval)
      console.log(`Error when reply: ${err}`)
      channel.send({ embeds: [new EmbedBuilder({ description: `Oops! Something went wrong. ${err}` }).setColor('Red')] })
    }
  })
}

run()