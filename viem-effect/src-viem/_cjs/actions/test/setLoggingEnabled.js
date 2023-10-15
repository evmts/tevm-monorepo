"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setLoggingEnabled = void 0;
async function setLoggingEnabled(client, enabled) {
    await client.request({
        method: `${client.mode}_setLoggingEnabled`,
        params: [enabled],
    });
}
exports.setLoggingEnabled = setLoggingEnabled;
//# sourceMappingURL=setLoggingEnabled.js.map