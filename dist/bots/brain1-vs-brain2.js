"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const AiBotChatroom_1 = __importDefault(require("./drivers/set/AiBotChatroom"));
const ChannelTextBot_1 = __importDefault(require("./drivers/ChannelTextBot"));
const prompt = `Please try to bring up topics related to design expertise, such as mathematics, physics, chemistry, biology, philosophy, culture, information technology, and more. The topics are not limited; keep the conversation engaging. Continue to make the dialogue interesting.`;
const Brain1 = new ChannelTextBot_1.default({
    token: constants_1.BRAIN1_TOKEN,
    guildId: constants_1.GUILD_ID,
    channelId: constants_1.BRAINS_CHANNEL_ID,
    prompt,
});
const Brain2 = new ChannelTextBot_1.default({
    token: constants_1.BRAIN2_TOKEN,
    guildId: constants_1.GUILD_ID,
    channelId: constants_1.BRAINS_CHANNEL_ID,
    prompt,
});
const Brain1VsBrain2 = new AiBotChatroom_1.default([Brain1, Brain2]);
exports.default = Brain1VsBrain2;
