"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BotSet extends Set {
    constructor(bots = []) {
        super(bots);
    }
    connect() {
        return Promise.all([...this].map(b => b.connect()));
    }
    disconnect() {
        return Promise.all([...this].map(b => b.disconnect()));
    }
}
exports.default = BotSet;
