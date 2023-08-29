"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const ChannelTextBot_1 = __importDefault(require("./drivers/ChannelTextBot"));
const Brain1 = new ChannelTextBot_1.default({
    token: constants_1.BRAIN1_TOKEN,
    guildId: constants_1.GUILD_ID,
    channelId: constants_1.BRAINS_CHANNEL_ID,
});
const Brain2 = new ChannelTextBot_1.default({
    token: constants_1.BRAIN2_TOKEN,
    guildId: constants_1.GUILD_ID,
    channelId: constants_1.BRAINS_CHANNEL_ID,
});
exports.default = Brain1;
