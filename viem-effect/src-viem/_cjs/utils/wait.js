"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wait = void 0;
async function wait(time) {
    return new Promise((res) => setTimeout(res, time));
}
exports.wait = wait;
//# sourceMappingURL=wait.js.map