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
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const uuid_1 = require("uuid");
const BotDriver_1 = __importDefault(require("./BotDriver"));
const utils_1 = require("./utils");
const gpt_1 = require("../../utils/gpt");
const log_text_1 = __importDefault(require("../../utils/log-text"));
const split_text_to_chunks_1 = __importDefault(require("../../utils/split-text-to-chunks"));
const _getTyping = (() => {
    var __TextChannelTypingManager_channel, __TextChannelTypingManager_typingInterval;
    class _TextChannelTypingManager extends Set {
        constructor(channel) {
            super();
            __TextChannelTypingManager_channel.set(this, void 0);
            __TextChannelTypingManager_typingInterval.set(this, void 0);
            __classPrivateFieldSet(this, __TextChannelTypingManager_channel, channel, "f");
        }
        startTyping() {
            const uuid = (0, uuid_1.v4)();
            this.add(uuid);
            if (this.size === 0) {
                __classPrivateFieldGet(this, __TextChannelTypingManager_channel, "f").sendTyping();
                __classPrivateFieldSet(this, __TextChannelTypingManager_typingInterval, setInterval(() => __classPrivateFieldGet(this, __TextChannelTypingManager_channel, "f").sendTyping(), 5000), "f");
                _typings.set(__classPrivateFieldGet(this, __TextChannelTypingManager_channel, "f"), this);
            }
            return uuid;
        }
        endTyping(uuid) {
            this.delete(uuid);
            if (this.size === 0) {
                clearInterval(__classPrivateFieldGet(this, __TextChannelTypingManager_typingInterval, "f"));
                _typings.delete(__classPrivateFieldGet(this, __TextChannelTypingManager_channel, "f"));
            }
        }
    }
    __TextChannelTypingManager_channel = new WeakMap(), __TextChannelTypingManager_typingInterval = new WeakMap();
    const _typings = new Map();
    return function (channel) {
        return _typings.get(channel) || new _TextChannelTypingManager(channel);
    };
})();
class TextBot extends BotDriver_1.default {
    constructor(token) {
        super(token);
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connect();
        });
    }
    respondInChannelAsCurva(channel, prompt = '') {
        return __awaiter(this, void 0, void 0, function* () {
            const typingId = this.startTyping(channel);
            const messages = yield this.getRecentChannelMessages(channel);
            const t0 = Date.now();
            const context = (0, gpt_1.dcMessagesToContext)(messages, this.id, 4800 - (0, gpt_1.countTokensLength)(prompt));
            (0, log_text_1.default)(`${this.name} Prepare in ${Date.now() - t0}ms`);
            try {
                const t0 = Date.now();
                const answer = yield (0, gpt_1.askWithCurva)('gpt4_t03_5k', `${prompt}\n\n${context}`, '');
                this.endTyping(channel, typingId);
                this.sendTextMessageInChunks(channel, answer);
                (0, log_text_1.default)(`${this.name} Reply in ${Date.now() - t0}ms`);
            }
            catch (err) {
                this.endTyping(channel, typingId);
                (0, log_text_1.default)(`${this.name} Error when reply: ${err}`);
                channel.send({ embeds: [new discord_js_1.EmbedBuilder({ description: `Oops! Something went wrong. ${err}` }).setColor('Red')] });
            }
        });
    }
    sendTextMessageInChunks(channel, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const chunks = (0, split_text_to_chunks_1.default)(content, 1800);
            for (const chunk of chunks) {
                yield channel.send(chunk);
            }
            return;
        });
    }
    getRecentChannelMessages(channel, replaceWithUsername = true) {
        return __awaiter(this, void 0, void 0, function* () {
            const t0 = Date.now();
            const messages = (yield channel.messages.fetch()).map(m => m);
            channel.messages.cache.clear();
            if (replaceWithUsername) {
                const mappedUidUsername = yield (0, utils_1.createMappedUidUsername)(messages);
                (0, log_text_1.default)(`${this.name} Fetched ${messages.length} messages in ${Date.now() - t0}ms`);
                return (0, utils_1.replaceMessagesUserPingToUsername)(messages, mappedUidUsername)
                    .map((message) => ({
                    createdAt: message.createdTimestamp,
                    uid: message.author.id,
                    user: mappedUidUsername.get(message.author.id) || 'anonymous',
                    content: message.content
                }))
                    .filter((m) => m.content.trim())
                    .reverse();
            }
            (0, log_text_1.default)(`${this.name} Fetched ${messages.length} messages in ${Date.now() - t0}ms`);
            return messages
                .map((message) => ({
                createdAt: message.createdTimestamp,
                uid: message.author.id,
                user: message.author.globalName || message.author.displayName || message.author.username,
                content: message.content
            }))
                .filter((m) => m.content.trim())
                .reverse();
        });
    }
    startTyping(channel) {
        return _getTyping(channel).startTyping();
    }
    endTyping(channel, uuid) {
        return _getTyping(channel).endTyping(uuid);
    }
}
exports.default = TextBot;
