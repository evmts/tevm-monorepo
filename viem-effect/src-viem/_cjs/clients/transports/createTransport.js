"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransport = void 0;
const buildRequest_js_1 = require("../../utils/buildRequest.js");
function createTransport({ key, name, request, retryCount = 3, retryDelay = 150, timeout, type, }, value) {
    return {
        config: { key, name, request, retryCount, retryDelay, timeout, type },
        request: (0, buildRequest_js_1.buildRequest)(request, { retryCount, retryDelay }),
        value,
    };
}
exports.createTransport = createTransport;
//# sourceMappingURL=createTransport.js.map