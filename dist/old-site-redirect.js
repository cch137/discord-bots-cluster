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
const server_1 = require("./server");
const axios_1 = __importDefault(require("axios"));
server_1.app.use('*', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tokenItem = (req.headers.cookie || '').split(';').map(c => c.split('=').map(i => i.trim())).find(c => c[0] === 'token');
    if (tokenItem === undefined) {
        res.redirect('https://cch137.link');
        return;
    }
    const token = decodeURIComponent(tokenItem[1]);
    const { id } = (yield axios_1.default.put('https://cch137-api.onrender.com/lockers', { item: token })).data;
    res.redirect(`https://cch137.link/api/auth/transfer?passport=${id}`);
}));
exports.default = () => console.log('All paths will be redirected to cch137.link.');
