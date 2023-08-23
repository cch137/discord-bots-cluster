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
exports.splitTextToChunks = exports.askCurva = exports.getRecentChannelMessages = exports.replaceUidToUsername = exports.extractUids = void 0;
const constants_1 = require("./constants");
const uidRegex = /<@(\d+)>/g;
function extractUids(message) {
    const matches = message.match(uidRegex);
    return matches
        ? matches.map(match => match.replace(/<@|>/g, ''))
        : [];
}
exports.extractUids = extractUids;
function replaceUidToUsername(message, userMap) {
    extractUids(message).forEach((uid) => {
        message = message.replace(new RegExp(`<@${uid}>`, 'g'), `@${userMap.get(uid) || 'anonymous'}`);
    });
    return message;
}
exports.replaceUidToUsername = replaceUidToUsername;
function getRecentChannelMessages(guild, channel, replaceWithUsername = true) {
    return __awaiter(this, void 0, void 0, function* () {
        const messages = yield channel.messages.fetch();
        const userIdList = new Set(messages.map((m) => m.author.id));
        for (const m of messages) {
            extractUids(m[1].content).forEach((uid) => userIdList.add(uid));
        }
        if (!replaceWithUsername) {
            return messages.map((message, key) => ({
                createdAt: message.createdTimestamp,
                uid: message.author.id,
                user: message.author.globalName || message.author.displayName || message.author.username,
                content: message.content
            })).filter((m) => m.content.trim()).reverse();
        }
        const users = new Map();
        yield Promise.all([...userIdList].map((id) => __awaiter(this, void 0, void 0, function* () {
            const user = yield guild.members.fetch({ user: id });
            const { nickname } = user;
            const { globalName, displayName, username } = user.user;
            users.set(id, nickname || globalName || displayName || username);
        })));
        return messages.map((message, key) => ({
            createdAt: message.createdTimestamp,
            uid: message.author.id,
            user: users.get(message.author.id) || 'anonymous',
            content: replaceUidToUsername(message.content, users)
        })).filter((m) => m.content.trim()).reverse();
    });
}
exports.getRecentChannelMessages = getRecentChannelMessages;
function askCurva(modelName = 'gpt4_t05_4k', question = 'Hi', context = '') {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch('https://ch4.onrender.com/api/curva/express', {
            method: 'POST',
            body: JSON.stringify({ key: constants_1.CURVA_API_KEY, modelName, question, context })
        });
        const { answer, error } = yield res.json();
        if (error)
            throw error;
        return answer;
    });
}
exports.askCurva = askCurva;
function splitTextToChunks(input, maxLength = 2000) {
    const result = [];
    for (let i = 0; i < input.length; i += maxLength) {
        result.push(input.substring(i, i + maxLength));
    }
    return result;
}
exports.splitTextToChunks = splitTextToChunks;
