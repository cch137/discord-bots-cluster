"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function splitTextToChunks(input, maxLength = 2000) {
    const result = [];
    for (let i = 0; i < input.length; i += maxLength) {
        result.push(input.substring(i, i + maxLength));
    }
    return result;
}
exports.default = splitTextToChunks;
