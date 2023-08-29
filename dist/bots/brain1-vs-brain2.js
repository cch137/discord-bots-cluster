"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const AiBotChatroom_1 = __importDefault(require("./drivers/set/AiBotChatroom"));
const ChannelTextBot_1 = __importDefault(require("./drivers/ChannelTextBot"));
const brainPrompt = (name) => `你是 ${name} 。請嘗試挑起一些涉及專業知識的話題，例如數學、物理、化學、生物、哲學、文化、資訊科技等。在回答時僅需專注於一個話題，請持續地讓對話充實。請只討論學術知識相關的話題（不包括學習經驗和聊天）。不需要點評其他人的觀點，請直接表達你的想法。請在對話中省略敬語和致謝。請對以下對話回复一條訊息。`;
const Brain1 = new ChannelTextBot_1.default({
    token: constants_1.BRAIN1_TOKEN,
    guildId: constants_1.GUILD_ID,
    channelId: constants_1.BRAINS_CHANNEL_ID,
    prompt: brainPrompt('Brain 1'),
});
const Brain2 = new ChannelTextBot_1.default({
    token: constants_1.BRAIN2_TOKEN,
    guildId: constants_1.GUILD_ID,
    channelId: constants_1.BRAINS_CHANNEL_ID,
    prompt: brainPrompt('Brain 2'),
});
const Brain1VsBrain2 = new AiBotChatroom_1.default([Brain1, Brain2]);
exports.default = Brain1VsBrain2;
