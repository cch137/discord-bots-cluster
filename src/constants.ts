import { config as dotenvConfig } from 'dotenv'

dotenvConfig()

const GUILD_ID = process.env.GUILD_ID as string
const BOT_TOKEN1 = process.env.BOT_TOKEN1 as string
const BOT_TOKEN2 = process.env.BOT_TOKEN2 as string
const CHANNEL_ID1 = process.env.CHANNEL_ID1 as string
const CHANNEL_ID2 = process.env.CHANNEL_ID2 as string
const CURVA_API_KEY = process.env.CURVA_API_KEY as string

if (typeof GUILD_ID !== 'string') {
  throw 'Please provide GUILD_ID in .env file'
}
if (typeof BOT_TOKEN1 !== 'string') {
  throw 'Please provide BOT_TOKEN1 in .env file'
}
if (typeof CHANNEL_ID1 !== 'string') {
  throw 'Please provide CHANNEL_ID1 in .env file'
}
if (typeof BOT_TOKEN2 !== 'string') {
  throw 'Please provide BOT_TOKEN2 in .env file'
}
if (typeof CHANNEL_ID2 !== 'string') {
  throw 'Please provide CHANNEL_ID2 in .env file'
}
if (typeof CURVA_API_KEY !== 'string') {
  throw 'Please provide CURVA_API_KEY in .env file'
}

export {
  BOT_TOKEN1,
  GUILD_ID,
  CHANNEL_ID1,
  BOT_TOKEN2,
  CHANNEL_ID2,
  CURVA_API_KEY,
}