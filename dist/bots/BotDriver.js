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
var _BotDriver_token;
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const log_date_1 = __importDefault(require("../utils/log-date"));
const utils_1 = require("./utils");
class BotDriver {
    constructor(token) {
        _BotDriver_token.set(this, void 0);
        __classPrivateFieldSet(this, _BotDriver_token, token, "f");
        this.client = new discord_js_1.Client({
            intents: [
                discord_js_1.IntentsBitField.Flags.Guilds,
                discord_js_1.IntentsBitField.Flags.GuildMembers,
                discord_js_1.IntentsBitField.Flags.GuildMessages,
                discord_js_1.IntentsBitField.Flags.MessageContent,
            ]
        });
    }
    get displayName() {
        var _a;
        return (_a = this.client.user) === null || _a === void 0 ? void 0 : _a.displayName;
    }
    get globalName() {
        var _a;
        return (_a = this.client.user) === null || _a === void 0 ? void 0 : _a.globalName;
    }
    get username() {
        var _a;
        return (_a = this.client.user) === null || _a === void 0 ? void 0 : _a.username;
    }
    get id() {
        return this.client.user.id;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.login(__classPrivateFieldGet(this, _BotDriver_token, "f"));
            this.loggedInAt = Date.now();
            (0, log_date_1.default)(`${this.username} Logged in at`, this.loggedInAt);
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.destroy();
            (0, log_date_1.default)(`${this.username} Logged out at`, Date.now());
        });
    }
    getRecentChannelMessages(guild, channel, replaceWithUsername = true) {
        return __awaiter(this, void 0, void 0, function* () {
            const messages = (yield channel.messages.fetch()).map(m => m);
            channel.messages.cache.clear();
            if (!replaceWithUsername) {
                return messages
                    .map((message) => ({
                    createdAt: message.createdTimestamp,
                    uid: message.author.id,
                    user: message.author.globalName || message.author.displayName || message.author.username,
                    content: message.content
                }))
                    .filter((m) => m.content.trim())
                    .reverse();
            }
            const mappedUidUsername = yield (0, utils_1.createMappedUidUsername)(guild, messages);
            return (0, utils_1.replaceMessagesUserPingToUsername)(messages, mappedUidUsername)
                .map((message) => ({
                createdAt: message.createdTimestamp,
                uid: message.author.id,
                user: mappedUidUsername.get(message.author.id) || 'anonymous',
                content: message.content
            }))
                .filter((m) => m.content.trim())
                .reverse();
        });
    }
}
_BotDriver_token = new WeakMap();
exports.default = BotDriver;
