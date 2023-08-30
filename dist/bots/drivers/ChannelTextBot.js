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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TextBot_1 = __importDefault(require("./TextBot"));
class ChannelTextBot extends TextBot_1.default {
    constructor(options) {
        const { token, guildId, channelId, prompt = '' } = options;
        super(token);
        this.guildId = guildId;
        this.channelId = channelId;
        this.prompt = prompt;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield TextBot_1.default.prototype.init.call(this);
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
        });
    }
    respondInChannelAsCurva(arg1 = 't03', arg2 = '', arg3 = 't03') {
        if (typeof arg1 === 'string') {
            return TextBot_1.default.prototype.respondInChannelAsCurva.call(this, this.channel, this.prompt, arg1);
        }
        return TextBot_1.default.prototype.respondInChannelAsCurva.call(this, arg1, arg2, arg3);
    }
    sendTextMessageInChunks(arg1, arg2) {
        if (typeof arg1 === 'string') {
            return TextBot_1.default.prototype.sendTextMessageInChunks.call(this, this.channel, arg1);
        }
        else {
            return TextBot_1.default.prototype.sendTextMessageInChunks.call(this, arg1, arg2 || '');
        }
    }
    getRecentChannelMessages(arg1, arg2, arg3) {
        if (arg1 !== undefined && typeof arg1 !== 'number') {
            return TextBot_1.default.prototype.getRecentChannelMessages.call(this, arg1, arg2, arg3);
        }
        else {
            return TextBot_1.default.prototype.getRecentChannelMessages.call(this, this.channel, arg1, arg2);
        }
    }
    startTyping() {
        return TextBot_1.default.prototype.startTyping.call(this, this.channel);
    }
    endTyping(arg1, arg2) {
        if (typeof arg1 === 'string') {
            return TextBot_1.default.prototype.endTyping.call(this, this.channel, arg1);
        }
        else {
            return TextBot_1.default.prototype.endTyping.call(this, arg1, arg2 || '');
        }
    }
}
exports.default = ChannelTextBot;
