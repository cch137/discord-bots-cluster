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
exports.replaceMessagesUserPingToUsername = exports.createMappedUidUsername = void 0;
const uidRegex = /<@(\d+)>/g;
function _extractUids(message) {
    const matches = message.match(uidRegex);
    return matches
        ? matches.map(match => match.replace(/<@|>/g, ''))
        : [];
}
function createMappedUidUsername(messages, usingNickname = false, guild) {
    return __awaiter(this, void 0, void 0, function* () {
        const userIdList = new Set(messages.map((m) => m.author.id));
        messages.forEach(m => _extractUids(m.content).forEach((uid) => userIdList.add(uid)));
        const mappedUidUsername = new Map();
        yield Promise.all([...userIdList].map((id) => __awaiter(this, void 0, void 0, function* () {
            const guildUser = (usingNickname && guild) ? yield guild.members.fetch({ user: id }) : null;
            const user = guildUser ? guildUser.user : messages.find(m => m.author.id === id).author;
            const nickname = (guildUser === null || guildUser === void 0 ? void 0 : guildUser.nickname) || '';
            const { globalName = '', displayName = '', username = '' } = user;
            mappedUidUsername.set(id, nickname || globalName || displayName || username);
        })));
        // guild.members.cache.clear()
        return mappedUidUsername;
    });
}
exports.createMappedUidUsername = createMappedUidUsername;
function replaceMessagesUserPingToUsername(messages, mappedUidUsername) {
    messages.forEach((message) => {
        _extractUids(message.content).forEach((uid) => {
            message.content = message.content.replace(new RegExp(`<@${uid}>`, 'g'), `@${mappedUidUsername.get(uid) || 'anonymous'}`);
        });
    });
    return messages;
}
exports.replaceMessagesUserPingToUsername = replaceMessagesUserPingToUsername;
