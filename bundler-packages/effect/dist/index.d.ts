import * as effect_Effect from 'effect/Effect';
import * as resolve from 'resolve';

declare class CreateRequireError extends Error {
    /**
     * @param {string} url
     * @param {object} [cause]
     * @param {unknown} [cause.cause]
     * @internal
     */
    constructor(url: string, options?: {});
    /**
     * @type {'CreateRequireError'}
     */
    _tag: 'CreateRequireError';
}
declare class RequireError extends Error {
    /**
     * @param {string} url
     * @param {object} [cause]
     * @param {unknown} [cause.cause]
     * @internal
     */
    constructor(url: string, options?: {});
    _tag: string;
}
declare function createRequireEffect(url: string): effect_Effect.Effect<never, CreateRequireError, (id: string) => effect_Effect.Effect<never, RequireError, ReturnType<NodeRequire>>>;

declare function fileExists(path: string): effect_Effect.Effect<never, never, boolean>;

declare function logAllErrors(e: unknown): effect_Effect.Effect<never, never, void>;

/**
 * Error thrown when the tsconfig.json file is not valid json
 * @internal
 */
declare class ParseJsonError extends Error {
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
declare function parseJson(jsonStr: string): effect_Effect.Effect<never, ParseJsonError, unknown>;

/**
 * @typedef {(importPath: string, options: import('resolve').SyncOpts & import('resolve').AsyncOpts) => import('effect/Effect').Effect<never, CouldNotResolveImportError, string>} ResolveSafe
 */
/**
 * Error thrown when 'node:resolve' throws
 */
declare class CouldNotResolveImportError extends Error {
    /**
     * @param {string} importPath
     * @param {string} absolutePath
     * @param {Error} cause
     */
    constructor(importPath: string, absolutePath: string, cause: Error);
    /**
     * @type {'CouldNotResolveImportError'}
     */
    _tag: 'CouldNotResolveImportError';
    /**
     * @type {'CouldNotResolveImportError'}
     * @override
     */
    override name: 'CouldNotResolveImportError';
}
/**
 * Effect wrapper around import('node:resolve').resolveSync
 * @type {ResolveSafe}
 * @example
 * ```ts
 * import {tap} from 'effect/Effect'
 * import {resolveSync} from '@tevm/effect'
 * resolveSync('react').pipe(
 *    tap(console.log)
 * )
 * ````
 * `
 */
declare const resolveSync: ResolveSafe;
/**
 * Effect wrpper around import('node:resolve')
 * @type {ResolveSafe}
 * @example
 * ```ts
 * import {tap} from 'effect/Effect'
 * import {resolveAsync} from '@tevm/effect'
 * resolveAsync('react').pipe(
 *    tap(console.log)
 * )
 * ````
 */
declare const resolveAsync: ResolveSafe;
type ResolveSafe = (importPath: string, options: resolve.SyncOpts & resolve.AsyncOpts) => effect_Effect.Effect<never, CouldNotResolveImportError, string>;

export { CouldNotResolveImportError, CreateRequireError, ParseJsonError, RequireError, type ResolveSafe, createRequireEffect, fileExists, logAllErrors, parseJson, resolveAsync, resolveSync };
