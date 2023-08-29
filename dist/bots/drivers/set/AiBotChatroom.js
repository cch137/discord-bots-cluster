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
var _AiBotChatroom_lastRespondStartedAt, _AiBotChatroom_isResponding;
Object.defineProperty(exports, "__esModule", { value: true });
const ChannelTextBotSet_1 = __importDefault(require("./ChannelTextBotSet"));
class AiBotChatroom extends ChannelTextBotSet_1.default {
    constructor(bots = [], cooldownMs = 5 * 60 * 1000) {
        super(bots);
        _AiBotChatroom_lastRespondStartedAt.set(this, 0);
        _AiBotChatroom_isResponding.set(this, false);
        this.cooldownMs = cooldownMs;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield ChannelTextBotSet_1.default.prototype.init.call(this);
            yield this.run();
        });
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            if (__classPrivateFieldGet(this, _AiBotChatroom_isResponding, "f"))
                return;
            __classPrivateFieldSet(this, _AiBotChatroom_isResponding, true, "f");
            const nextBot = yield this.getNextBot();
            __classPrivateFieldSet(this, _AiBotChatroom_lastRespondStartedAt, Date.now(), "f");
            nextBot.respondInChannelAsCurva()
                .then(() => {
                __classPrivateFieldSet(this, _AiBotChatroom_isResponding, false, "f");
                if (__classPrivateFieldGet(this, _AiBotChatroom_lastRespondStartedAt, "f") + this.cooldownMs < Date.now()) {
                    setTimeout(() => this.run(), 0);
                }
                else {
                    const nextRunAt = __classPrivateFieldGet(this, _AiBotChatroom_lastRespondStartedAt, "f") + this.cooldownMs;
                    setTimeout(() => this.run(), nextRunAt - Date.now());
                }
            });
        });
    }
    getNextBot() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const lastMessageUid = (_a = (yield this.bots[0].getRecentChannelMessages(1))[0]) === null || _a === void 0 ? void 0 : _a.uid;
            return this.bots.find(b => b.id !== lastMessageUid);
        });
    }
}
_AiBotChatroom_lastRespondStartedAt = new WeakMap(), _AiBotChatroom_isResponding = new WeakMap();
exports.default = AiBotChatroom;
