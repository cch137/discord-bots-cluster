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
const log_text_1 = __importDefault(require("../../utils/log-text"));
const ChannelTextBot_1 = __importDefault(require("./ChannelTextBot"));
class AutomatedReplyChannelTextBot extends ChannelTextBot_1.default {
    constructor(options) {
        super(options);
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield ChannelTextBot_1.default.prototype.init.call(this);
            this.client.on('messageCreate', (message) => __awaiter(this, void 0, void 0, function* () {
                if (message.author.id === this.id)
                    return;
                if (message.channelId !== this.channelId)
                    return;
                (0, log_text_1.default)(`${this.name} Received a message.`);
                this.respondInChannelAsCurva();
            }));
        });
    }
}
exports.default = AutomatedReplyChannelTextBot;
