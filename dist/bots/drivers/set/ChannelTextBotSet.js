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
const TextBotSet_1 = __importDefault(require("./TextBotSet"));
class ChannelTextBotSet extends TextBotSet_1.default {
    constructor(bots = []) {
        super(bots);
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield TextBotSet_1.default.prototype.init.call(this);
            return;
        });
    }
}
exports.default = ChannelTextBotSet;
