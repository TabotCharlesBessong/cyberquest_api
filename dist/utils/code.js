"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCode = generateCode;
const ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
/**
 * Generates a random code of the given length using numbers and capital letters.
 * Default length is 6 (per product spec for account verification).
 */
function generateCode(length = 6) {
    let code = "";
    for (let i = 0; i < length; i++) {
        code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
    }
    return code;
}
//# sourceMappingURL=code.js.map