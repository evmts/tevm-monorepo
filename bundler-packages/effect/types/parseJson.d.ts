/**
 * Error thrown when the tsconfig.json file is not valid json
 * @internal
 */
export class ParseJsonError extends Error {
    /**
     * @param {object} [options]
     * @param {unknown} [options.cause]
     */
    constructor(options?: {
        cause?: unknown;
    } | undefined);
    /**
     * @type {'ParseJsonError'}
     */
    _tag: 'ParseJsonError';
}
export function parseJson(jsonStr: string): import("effect/Effect").Effect<never, ParseJsonError, unknown>;
//# sourceMappingURL=parseJson.d.ts.map