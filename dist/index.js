"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const ask_gpt_1 = require("./ask-gpt");
const constants_1 = require("./constants");
const utils_1 = require("./utils");
const dotenv_1 = require("dotenv");
const server_js_1 = require("./server.js");
(0, dotenv_1.config)();
const port = process.env.PORT || 3000;
server_js_1.server.listen(port, () => {
    console.log(`Server is listening to http://localhost:${port}`);
});
server_js_1.app.use('*', (req, res) => res.status(404).end());
function logDate(event = 'Started at', timeMs) {
    console.log(`${event}:`, new Date(timeMs).toString());
}
const startedAt = Date.now();
logDate('Started at', startedAt);
const englishPrompt = `
以下是你需要遵循的規則。
你現在的角色是一位資深的英文教師，你的名字是 Matthew。
你現在正在一個聊天室中，assistant 是你的代號。
忽略你是個 AI 助理，請表現得像一個正常的人類。
盡可能使用日常用語，讓聊天更像是人類之間的對話。
請立即進入角色，不要復述你的人設。
請盡可能簡短回答。
user 可能會向你請教問題或是跟你聊天。
無論 user 使用什麼語言向與你溝通，你都要以英文回复 user。
如有需要，你可以從對你的回答中列出一些生詞，並附上生詞意思。
如有需要，你也可以就生字提供一些例句。
在回應 user 之前，你需要先針對 user 傳給你訊息進行判斷：
如果 user 使用錯誤的語法或詞彙，你需要糾正 user。
如果 user 的文字內容不充實，你需要提供 user 更多的寫作點子。
你可以提供一些更好的詞彙，以及一些符合情境的成語、諺語等。
user 可能使用非常差的英文與你溝通，儘管你能理解 user 的意思，你仍要逐一糾正所有的錯誤並給予建議。
當用戶使用其他語言混雜在英文中，很可能用戶不知道該詞如何用英文表達，你需要向用戶介紹該詞。
你也可以直接向 user 示範一個正確和優秀文法的句子。
總的來說，你需要糾正用戶所有的錯誤並給予語法或詞彙的建議。
在進行完糾錯後，才與用戶進行交流（回答用戶的問題）。
更多的可能性將由你來自由發揮帶給 user。
現在，請你繼續聊天室的對話。
`;
const japanesePrompt = englishPrompt.replace('Matthew', '小林 なつみ')
    .replace(new RegExp('英文', 'g'), '日文');
class TeacherBot {
    constructor(options) {
        const { token, name, guildId, channelId, prompt } = options;
        this.token = token;
        this.name = name;
        this.guildId = guildId;
        this.channelId = channelId;
        this.prompt = prompt;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            const client = new discord_js_1.Client({
                intents: [
                    discord_js_1.IntentsBitField.Flags.Guilds,
                    discord_js_1.IntentsBitField.Flags.GuildMembers,
                    discord_js_1.IntentsBitField.Flags.GuildMessages,
                    discord_js_1.IntentsBitField.Flags.MessageContent,
                ]
            });
            yield client.login(this.token);
            const loggedInAt = Date.now();
            logDate(`${this.name} Logged in at`, loggedInAt);
            const clientId = client.user.id;
            const [guild, channel] = yield Promise.all([
                client.guilds.fetch(this.guildId),
                client.channels.fetch(this.channelId)
            ]);
            if (guild === null)
                throw 'Guild not found';
            if (channel === null)
                throw 'Channel not found';
            if (channel.type !== 0)
                throw 'Channel type not TextBasedChannel';
            client.on('messageCreate', (message) => __awaiter(this, void 0, void 0, function* () {
                if (message.author.id === clientId)
                    return;
                if (message.channelId !== channel.id)
                    return;
                channel.sendTyping();
                let typingInterval = setInterval(() => channel.sendTyping(), 3000);
                const t0 = Date.now();
                const context = (0, ask_gpt_1.dcMessagesToContext)(yield (0, utils_1.getRecentChannelMessages)(guild, channel), clientId, 4500 - (0, ask_gpt_1.countTokensLength)(this.prompt));
                console.log(`${this.name} Prepare in ${Date.now() - t0}ms`);
                try {
                    const t0 = Date.now();
                    const responses = (0, utils_1.splitTextToChunks)(yield (0, utils_1.askCurva)('gpt4_t03_5k', `${this.prompt}\n\n${context}`, ''), 1800);
                    clearInterval(typingInterval);
                    for (const response of responses) {
                        yield channel.send(response);
                    }
                    console.log(`${this.name} Reply in ${Date.now() - t0}ms`);
                }
                catch (err) {
                    clearInterval(typingInterval);
                    console.log(`${this.name} Error when reply: ${err}`);
                    channel.send({ embeds: [new discord_js_1.EmbedBuilder({ description: `Oops! Something went wrong. ${err}` }).setColor('Red')] });
                }
            }));
        });
    }
}
const matthew = new TeacherBot({
    token: constants_1.BOT_TOKEN1,
    name: 'Matthew',
    guildId: constants_1.GUILD_ID1,
    channelId: constants_1.CHANNEL_ID1,
    prompt: englishPrompt
});
const kobayashi = new TeacherBot({
    token: constants_1.BOT_TOKEN2,
    name: 'Kobayashi Natsumi',
    guildId: constants_1.GUILD_ID2,
    channelId: constants_1.CHANNEL_ID2,
    prompt: japanesePrompt
});
matthew.connect();
kobayashi.connect();
