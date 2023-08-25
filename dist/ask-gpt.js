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
exports.dcMessagesToContext = exports.messagesToContext = exports.dcToOpenAIMessages = exports.countTokensLength = void 0;
const dotenv_1 = require("dotenv");
const mindsdb_js_sdk_1 = __importDefault(require("mindsdb-js-sdk"));
const tiktoken_1 = require("@dqbd/tiktoken");
(0, dotenv_1.config)();
const connection = (() => __awaiter(void 0, void 0, void 0, function* () {
    yield mindsdb_js_sdk_1.default.connect({
        user: process.env.MINDSDB_EMAIL || '',
        password: process.env.MINDSDB_PASSWD || ''
    });
    return mindsdb_js_sdk_1.default;
}))();
function stringEscape(text = '') {
    const singleQInText = text.includes('\'');
    const doubleQInText = text.includes('\"');
    if (doubleQInText && singleQInText) {
        return `"${text.replace(new RegExp('\"', 'g'), '\'')}"`;
    }
    if (singleQInText) {
        return `"${text}"`;
    }
    return `'${text}'`;
}
function askGPT(modelName = 'gpt4_t05_4k', question = '', context = '') {
    return __awaiter(this, void 0, void 0, function* () {
        const model = yield (yield connection).Models.getModel(modelName, 'mindsdb');
        return (yield model.query({
            where: [`question=${stringEscape(question)}`, `context=${stringEscape(context)}`]
        })).value;
    });
}
function dcToOpenAIMessages(messages, clientId) {
    return messages.map((m) => ({
        role: m.uid === clientId ? 'assistant' : `@${m.user}`,
        content: m.content
    }));
}
exports.dcToOpenAIMessages = dcToOpenAIMessages;
function _messagesToContext(messages) {
    return messages.map((m) => {
        return `${m.role}:\n${m.content}`;
    }).join('\n\n');
}
function countTokensLength(text) {
    return (0, tiktoken_1.encoding_for_model)('gpt-4').encode(text).length;
}
exports.countTokensLength = countTokensLength;
function messagesToContext(messages, maxToken = 4000) {
    messages = [...messages];
    const countedMessages = messages.map(m => (Object.assign({ tokens: countTokensLength(m.content) + 10 }, m)));
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
exports.default = askGPT;
