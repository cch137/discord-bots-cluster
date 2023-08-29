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
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _TextChannelHost_typingThreads, _TextChannelHost_typingInterval, _TextChannelHost_isTyping;
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const uuid_1 = require("uuid");
const splitTextToChunks_1 = __importDefault(require("../utils/splitTextToChunks"));
const gpt_1 = require("../utils/gpt");
const _1 = require(".");
class TextChannelHost extends _1.BotDriver {
    get name() {
        return this.username;
    }
    constructor(options) {
        const { token, guildId, channelId, prompt } = options;
        super(token);
        _TextChannelHost_typingThreads.set(this, new Set());
        _TextChannelHost_typingInterval.set(this, void 0);
        _TextChannelHost_isTyping.set(this, false);
        this.guildId = guildId;
        this.channelId = channelId;
        this.prompt = prompt;
    }
    getRecentChannelMessages() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield _1.BotDriver.prototype.getRecentChannelMessages.call(this, this.guild, this.channel);
        });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connect();
            const [guild, channel] = yield Promise.all([
                this.client.guilds.fetch(this.guildId),
                this.client.channels.fetch(this.channelId)
            ]);
            if (guild === null)
                throw 'Guild not found';
            if (channel === null)
                throw 'Channel not found';
            if (channel.type !== 0)
                throw 'Channel is not a TextBasedChannel';
            this.guild = guild;
            this.channel = channel;
            this.client.on('messageCreate', (message) => __awaiter(this, void 0, void 0, function* () {
                if (message.author.id === this.id)
                    return;
                if (message.channelId !== this.channelId)
                    return;
                console.log(`${this.name} Received a message.`);
                const typingId = this.startTyping();
                const t0 = Date.now();
                const messages = yield this.getRecentChannelMessages();
                console.log(`${this.name} Fetched ${messages.length} messages in ${Date.now() - t0}ms`);
                const t1 = Date.now();
                const context = (0, gpt_1.dcMessagesToContext)(messages, this.id, 4800 - (0, gpt_1.countTokensLength)(this.prompt));
                console.log(`${this.name} Prepare in ${Date.now() - t1}ms`);
                try {
                    const t0 = Date.now();
                    const responses = (0, splitTextToChunks_1.default)(yield (0, gpt_1.askWithCurva)('gpt4_t03_5k', `${this.prompt}\n\n${context}`, ''), 1800);
                    this.endTyping(typingId);
                    for (const response of responses) {
                        yield this.channel.send(response);
                    }
                    console.log(`${this.name} Reply in ${Date.now() - t0}ms`);
                }
                catch (err) {
                    this.endTyping(typingId);
                    console.log(`${this.name} Error when reply: ${err}`);
                    this.channel.send({ embeds: [new discord_js_1.EmbedBuilder({ description: `Oops! Something went wrong. ${err}` }).setColor('Red')] });
                }
            }));
        });
    }
    startTyping() {
        const uuid = (0, uuid_1.v4)();
        __classPrivateFieldGet(this, _TextChannelHost_typingThreads, "f").add(uuid);
        if (!__classPrivateFieldGet(this, _TextChannelHost_isTyping, "f")) {
            __classPrivateFieldSet(this, _TextChannelHost_isTyping, true, "f");
            this.channel.sendTyping();
            __classPrivateFieldSet(this, _TextChannelHost_typingInterval, setInterval(() => this.channel.sendTyping(), 5000), "f");
        }
        return uuid;
    }
    endTyping(uuid) {
        __classPrivateFieldGet(this, _TextChannelHost_typingThreads, "f").delete(uuid);
        if (__classPrivateFieldGet(this, _TextChannelHost_typingThreads, "f").size === 0) {
            clearInterval(__classPrivateFieldGet(this, _TextChannelHost_typingInterval, "f"));
            __classPrivateFieldSet(this, _TextChannelHost_isTyping, false, "f");
        }
    }
}
_TextChannelHost_typingThreads = new WeakMap(), _TextChannelHost_typingInterval = new WeakMap(), _TextChannelHost_isTyping = new WeakMap();
exports.default = TextChannelHost;
