"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withCache = exports.getCache = exports.responseCache = exports.promiseCache = void 0;
exports.promiseCache = new Map();
exports.responseCache = new Map();
function getCache(cacheKey) {
    const buildCache = (cacheKey, cache) => ({
        clear: () => cache.delete(cacheKey),
        get: () => cache.get(cacheKey),
        set: (data) => cache.set(cacheKey, data),
    });
    const promise = buildCache(cacheKey, exports.promiseCache);
    const response = buildCache(cacheKey, exports.responseCache);
    return {
        clear: () => {
            promise.clear();
            response.clear();
        },
        promise,
        response,
    };
}
exports.getCache = getCache;
async function withCache(fn, { cacheKey, cacheTime = Infinity }) {
    const cache = getCache(cacheKey);
    const response = cache.response.get();
    if (response && cacheTime > 0) {
        const age = new Date().getTime() - response.created.getTime();
        if (age < cacheTime)
            return response.data;
    }
    let promise = cache.promise.get();
    if (!promise) {
        promise = fn();
        cache.promise.set(promise);
    }
    try {
        const data = await promise;
        cache.response.set({ created: new Date(), data });
        return data;
    }
    finally {
        cache.promise.clear();
    }
}
exports.withCache = withCache;
//# sourceMappingURL=withCache.js.map