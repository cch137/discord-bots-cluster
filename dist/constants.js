"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CURVA_API_KEY = exports.BRAINS_CHANNEL_ID = exports.CHANNEL_ID2 = exports.CHANNEL_ID1 = exports.BRAIN2_TOKEN = exports.BRAIN1_TOKEN = exports.BOT_TOKEN2 = exports.BOT_TOKEN1 = exports.GUILD_ID = exports.CH4_TOKEN = exports.API_ORIGIN = void 0;
const API_ORIGIN = process.env.API_ORIGIN;
exports.API_ORIGIN = API_ORIGIN;
const CH4_TOKEN = process.env.CH4_TOKEN;
exports.CH4_TOKEN = CH4_TOKEN;
const GUILD_ID = process.env.GUILD_ID;
exports.GUILD_ID = GUILD_ID;
const BOT_TOKEN1 = process.env.BOT_TOKEN1;
exports.BOT_TOKEN1 = BOT_TOKEN1;
const BOT_TOKEN2 = process.env.BOT_TOKEN2;
exports.BOT_TOKEN2 = BOT_TOKEN2;
const BRAIN1_TOKEN = process.env.BRAIN1_TOKEN;
exports.BRAIN1_TOKEN = BRAIN1_TOKEN;
const BRAIN2_TOKEN = process.env.BRAIN2_TOKEN;
exports.BRAIN2_TOKEN = BRAIN2_TOKEN;
const CHANNEL_ID1 = process.env.CHANNEL_ID1;
exports.CHANNEL_ID1 = CHANNEL_ID1;
const CHANNEL_ID2 = process.env.CHANNEL_ID2;
exports.CHANNEL_ID2 = CHANNEL_ID2;
const BRAINS_CHANNEL_ID = process.env.BRAINS_CHANNEL_ID;
exports.BRAINS_CHANNEL_ID = BRAINS_CHANNEL_ID;
const CURVA_API_KEY = process.env.CURVA_API_KEY;
exports.CURVA_API_KEY = CURVA_API_KEY;
if (typeof API_ORIGIN !== 'string') {
    throw 'Please provide API_ORIGIN in .env file';
}
if (typeof CH4_TOKEN !== 'string') {
    throw 'Please provide CH4_TOKEN in .env file';
}
if (typeof GUILD_ID !== 'string') {
    throw 'Please provide GUILD_ID in .env file';
}
if (typeof BOT_TOKEN1 !== 'string') {
    throw 'Please provide BOT_TOKEN1 in .env file';
}
if (typeof BOT_TOKEN2 !== 'string') {
    throw 'Please provide BOT_TOKEN2 in .env file';
}
if (typeof BRAIN1_TOKEN !== 'string') {
    throw 'Please provide BRAIN1_TOKEN in .env file';
}
if (typeof BRAIN2_TOKEN !== 'string') {
    throw 'Please provide BRAIN2_TOKEN in .env file';
}
if (typeof CHANNEL_ID1 !== 'string') {
    throw 'Please provide CHANNEL_ID1 in .env file';
}
if (typeof CHANNEL_ID2 !== 'string') {
    throw 'Please provide CHANNEL_ID2 in .env file';
}
if (typeof BRAINS_CHANNEL_ID !== 'string') {
    throw 'Please provide BRAINS_CHANNEL_ID in .env file';
}
if (typeof CURVA_API_KEY !== 'string') {
    throw 'Please provide CURVA_API_KEY in .env file';
}
