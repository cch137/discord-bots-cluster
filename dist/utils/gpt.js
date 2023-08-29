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
exports.askWithCurva = exports.dcMessagesToContext = exports.messagesToContext = exports.dcToOpenAIMessages = exports.countTokensLength = void 0;
const tiktoken_1 = require("@dqbd/tiktoken");
const constants_1 = require("../constants");
function dcToOpenAIMessages(messages, clientId) {
    return messages.map((m) => ({
        role: `${m.user}${m.uid === clientId ? ' (You)' : ''}`,
        content: m.content
    }));
}
exports.dcToOpenAIMessages = dcToOpenAIMessages;
function _messagesToContext(messages) {
    return messages.map((m) => {
        return `${m.role}:\n${m.content}`;
    }).join('\n\n');
}
const gpt4Tiktoken = (0, tiktoken_1.encoding_for_model)('gpt-4');
function countTokensLength(text) {
    return gpt4Tiktoken.encode(text).length;
}
exports.countTokensLength = countTokensLength;
function messagesToContext(messages, maxToken = 4000) {
    messages = [...messages];
    const countedMessages = messages.map((m) => (Object.assign({ tokens: countTokensLength(m.content) + 10 }, m)));
    while (countedMessages.map(m => m.tokens).reduce((a, b) => a + b, 0) > maxToken) {
        countedMessages.shift();
    }
    return _messagesToContext(countedMessages.map(m => ({ role: m.role, content: m.content })));
}
exports.messagesToContext = messagesToContext;
function dcMessagesToContext(messages, clientId, maxToken = 4000) {
    return messagesToContext(dcToOpenAIMessages(messages, clientId), maxToken);
}
exports.dcMessagesToContext = dcMessagesToContext;
function askWithCurva(modelName = 'gpt4_t05_4k', question = 'Hi', context = '') {
    return __awaiter(this, void 0, void 0, function* () {
        question = question.trim();
        context = context.trim();
        const res = yield fetch('https://cch137.link/api/curva/express', {
            method: 'POST',
            body: JSON.stringify({ key: constants_1.CURVA_API_KEY, modelName, question, context })
        });
        const { answer, error } = yield res.json();
        if (error)
            throw error;
        return answer;
    });
}
exports.askWithCurva = askWithCurva;
