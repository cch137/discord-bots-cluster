"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const kobayashi_natsumi_1 = __importDefault(require("./kobayashi-natsumi"));
const mr_matthew_1 = __importDefault(require("./mr-matthew"));
const brain1_vs_brain2_1 = __importDefault(require("./brain1-vs-brain2"));
const bots = {
    KobayashiNatsumi: kobayashi_natsumi_1.default,
    MrMatthew: mr_matthew_1.default,
    Brain1VsBrain2: brain1_vs_brain2_1.default,
    initAll() {
        return Promise.all([
            kobayashi_natsumi_1.default.init(),
            mr_matthew_1.default.init(),
            brain1_vs_brain2_1.default.init(),
        ]);
    },
    connectAll() {
        return Promise.all([
            kobayashi_natsumi_1.default.connect(),
            mr_matthew_1.default.connect(),
            brain1_vs_brain2_1.default.connect(),
        ]);
    },
    disconnectAll() {
        return Promise.all([
            kobayashi_natsumi_1.default.disconnect(),
            mr_matthew_1.default.disconnect(),
            brain1_vs_brain2_1.default.disconnect(),
        ]);
    },
};
exports.default = bots;
