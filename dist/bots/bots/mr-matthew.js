"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../constants");
const TextChannelHost_1 = __importDefault(require("../roles/TextChannelHost"));
const language_teacher_1 = __importDefault(require("../prompts/language-teacher"));
const MrMatthew = new TextChannelHost_1.default({
    token: constants_1.BOT_TOKEN1,
    guildId: constants_1.GUILD_ID,
    channelId: constants_1.CHANNEL_ID1,
    prompt: (0, language_teacher_1.default)('Mr. Matthew', 'English')
});
exports.default = MrMatthew;
