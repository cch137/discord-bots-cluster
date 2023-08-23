"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CURVA_API_KEY = exports.CHANNEL_ID2 = exports.GUILD_ID2 = exports.BOT_TOKEN2 = exports.CHANNEL_ID1 = exports.GUILD_ID1 = exports.BOT_TOKEN1 = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const BOT_TOKEN1 = process.env.BOT_TOKEN1;
exports.BOT_TOKEN1 = BOT_TOKEN1;
const GUILD_ID1 = process.env.GUILD_ID1;
exports.GUILD_ID1 = GUILD_ID1;
const CHANNEL_ID1 = process.env.CHANNEL_ID1;
exports.CHANNEL_ID1 = CHANNEL_ID1;
const BOT_TOKEN2 = process.env.BOT_TOKEN2;
exports.BOT_TOKEN2 = BOT_TOKEN2;
const GUILD_ID2 = process.env.GUILD_ID2;
exports.GUILD_ID2 = GUILD_ID2;
const CHANNEL_ID2 = process.env.CHANNEL_ID2;
exports.CHANNEL_ID2 = CHANNEL_ID2;
const CURVA_API_KEY = process.env.CURVA_API_KEY;
exports.CURVA_API_KEY = CURVA_API_KEY;
if (typeof BOT_TOKEN1 !== 'string') {
    throw 'Please provide BOT_TOKEN1 in .env file';
}
if (typeof GUILD_ID1 !== 'string') {
    throw 'Please provide GUILD_ID1 in .env file';
}
if (typeof CHANNEL_ID1 !== 'string') {
    throw 'Please provide CHANNEL_ID1 in .env file';
}
if (typeof BOT_TOKEN2 !== 'string') {
    throw 'Please provide BOT_TOKEN2 in .env file';
}
if (typeof GUILD_ID2 !== 'string') {
    throw 'Please provide GUILD_ID2 in .env file';
}
if (typeof CHANNEL_ID2 !== 'string') {
    throw 'Please provide CHANNEL_ID2 in .env file';
}
if (typeof CURVA_API_KEY !== 'string') {
    throw 'Please provide CURVA_API_KEY in .env file';
}
