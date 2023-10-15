"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBlockFilter = void 0;
const createFilterRequestScope_js_1 = require("../../utils/filters/createFilterRequestScope.js");
async function createBlockFilter(client) {
    const getRequest = (0, createFilterRequestScope_js_1.createFilterRequestScope)(client, {
        method: 'eth_newBlockFilter',
    });
    const id = await client.request({
        method: 'eth_newBlockFilter',
    });
    return { id, request: getRequest(id), type: 'block' };
}
exports.createBlockFilter = createBlockFilter;
//# sourceMappingURL=createBlockFilter.js.map