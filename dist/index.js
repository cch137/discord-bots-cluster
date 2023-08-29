"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
const old_site_redirect_1 = __importDefault(require("./website/old-site-redirect"));
const log_date_1 = __importDefault(require("./utils/log-date"));
const port = process.env.PORT || 5000;
// bots.initAll();
server_1.server.listen(port, () => {
    (0, old_site_redirect_1.default)();
    console.log(`Server is listening to http://localhost:${port}`);
});
const startedAt = Date.now();
(0, log_date_1.default)('Started at', startedAt);
