"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFilterRequestScope = void 0;
function createFilterRequestScope(client, { method }) {
    const requestMap = {};
    if (client.transport.type === 'fallback')
        client.transport.onResponse?.(({ method: method_, response: id, status, transport, }) => {
            if (status === 'success' && method === method_)
                requestMap[id] = transport.request;
        });
    return ((id) => requestMap[id] || client.request);
}
exports.createFilterRequestScope = createFilterRequestScope;
//# sourceMappingURL=createFilterRequestScope.js.map