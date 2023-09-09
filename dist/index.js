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
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const server_1 = require("./server");
const log_date_1 = __importDefault(require("./utils/log-date"));
const bots_1 = __importDefault(require("./bots"));
const index_1 = __importDefault(require("./ch4/index"));
const apis_1 = __importDefault(require("./website/apis"));
const old_site_redirect_1 = __importDefault(require("./website/old-site-redirect"));
const admin_apis_1 = __importDefault(require("./website/admin-apis"));
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield bots_1.default.initAll();
    index_1.default.connect();
}))();
server_1.app.use('/', apis_1.default);
server_1.app.use('/', admin_apis_1.default);
server_1.app.use('/', old_site_redirect_1.default);
const port = process.env.PORT || 3000;
server_1.server.listen(port, () => {
    console.log(`Server is listening to http://localhost:${port}`);
});
const startedAt = Date.now();
(0, log_date_1.default)('Started at', startedAt);
