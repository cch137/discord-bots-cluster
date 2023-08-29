"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function logDate(event = 'Started at', timeMs) {
    console.log(`${event}:`, new Date(timeMs).toString());
}
exports.default = logDate;
