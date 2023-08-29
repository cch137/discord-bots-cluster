import { config as dotenvConfig } from 'dotenv'

dotenvConfig()

const GUILD_ID = process.env.GUILD_ID as string
const BOT_TOKEN1 = process.env.BOT_TOKEN1 as string
const BOT_TOKEN2 = process.env.BOT_TOKEN2 as string
const BRAIN1_TOKEN = process.env.BRAIN1_TOKEN as string
const BRAIN2_TOKEN = process.env.BRAIN2_TOKEN as string
const CHANNEL_ID1 = process.env.CHANNEL_ID1 as string
const CHANNEL_ID2 = process.env.CHANNEL_ID2 as string
const BRAINS_CHANNEL_ID = process.env.BRAINS_CHANNEL_ID as string
const CURVA_API_KEY = process.env.CURVA_API_KEY as string

if (typeof GUILD_ID !== 'string') {
  throw 'Please provide GUILD_ID in .env file'
}
if (typeof BOT_TOKEN1 !== 'string') {
  throw 'Please provide BOT_TOKEN1 in .env file'
}
if (typeof BOT_TOKEN2 !== 'string') {
  throw 'Please provide BOT_TOKEN2 in .env file'
}
if (typeof BRAIN1_TOKEN !== 'string') {
  throw 'Please provide BRAIN1_TOKEN in .env file'
}
if (typeof BRAIN2_TOKEN !== 'string') {
  throw 'Please provide BRAIN2_TOKEN in .env file'
}
if (typeof CHANNEL_ID1 !== 'string') {
  throw 'Please provide CHANNEL_ID1 in .env file'
}
if (typeof CHANNEL_ID2 !== 'string') {
  throw 'Please provide CHANNEL_ID2 in .env file'
}
if (typeof BRAINS_CHANNEL_ID !== 'string') {
  throw 'Please provide BRAINS_CHANNEL_ID in .env file'
}
if (typeof CURVA_API_KEY !== 'string') {
  throw 'Please provide CURVA_API_KEY in .env file'
}

export {
  GUILD_ID,
  BOT_TOKEN1,
  BOT_TOKEN2,
  BRAIN1_TOKEN,
  BRAIN2_TOKEN,
  CHANNEL_ID1,
  CHANNEL_ID2,
  BRAINS_CHANNEL_ID,
  CURVA_API_KEY,
}
