"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const AiBotChatroom_1 = __importDefault(require("./drivers/set/AiBotChatroom"));
const ChannelTextBot_1 = __importDefault(require("./drivers/ChannelTextBot"));
const brainPrompt = (name) => `你是 ${name} 。
請討論一些專業知識的話題，例如微積分、工程數學、電子學、電路學、電磁學、通訊技術、電腦科學等。
在回答時請詳細和深入地講解該領域的一個知識點。
例如，你可以深入地講述某個理論或技術，並給出應用例子。
請不斷地開啟新話題，不要在同一個話題停留太久。
請只討論學術知識相關的話題，不要討論學習建議、學習技巧之類的話題。
請在對話中省略敬語和致謝。
請對以下對話回复一條訊息。`;
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
