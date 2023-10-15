import { buildRequest } from '../../utils/buildRequest.js';
/**
 * @description Creates an transport intended to be used with a client.
 */
export function createTransport({ key, name, request, retryCount = 3, retryDelay = 150, timeout, type, }, value) {
    return {
        config: { key, name, request, retryCount, retryDelay, timeout, type },
        request: buildRequest(request, { retryCount, retryDelay }),
        value,
    };
}
//# sourceMappingURL=createTransport.js.map