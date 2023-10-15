"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.custom = void 0;
const createTransport_js_1 = require("./createTransport.js");
function custom(provider, config = {}) {
    const { key = 'custom', name = 'Custom Provider', retryDelay } = config;
    return ({ retryCount: defaultRetryCount }) => (0, createTransport_js_1.createTransport)({
        key,
        name,
        request: provider.request.bind(provider),
        retryCount: config.retryCount ?? defaultRetryCount,
        retryDelay,
        type: 'custom',
    });
}
exports.custom = custom;
//# sourceMappingURL=custom.js.map