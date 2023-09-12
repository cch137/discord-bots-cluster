"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const AutomatedReplyChannelTextBot_1 = __importDefault(require("./drivers/AutomatedReplyChannelTextBot"));
const yamazaki_1 = __importDefault(require("./prompts/yamazaki"));
const Yamazaki = new AutomatedReplyChannelTextBot_1.default({
    token: constants_1.BOT_TOKEN3,
    guildId: constants_1.GUILD_ID,
    channelId: constants_1.CHANNEL_ID3,
    prompt: (0, yamazaki_1.default)()
});
exports.default = Yamazaki;
