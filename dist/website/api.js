"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const apisRouter = express_1.default.Router();
apisRouter.get('/dashboard', (req, res) => {
    res.sendFile(path_1.default.resolve(__dirname, '../../pages/dashboard.html'));
});
exports.default = apisRouter;
