/**
 * @typedef {(importPath: string, options: import('resolve').SyncOpts & import('resolve').AsyncOpts) => import('effect/Effect').Effect<never, CouldNotResolveImportError, string>} ResolveSafe
 */
/**
 * Error thrown when 'node:resolve' throws
 */
export class CouldNotResolveImportError extends Error {
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
export const resolveSync: ResolveSafe;
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
export const resolveAsync: ResolveSafe;
export type ResolveSafe = (importPath: string, options: import('resolve').SyncOpts & import('resolve').AsyncOpts) => import('effect/Effect').Effect<never, CouldNotResolveImportError, string>;
//# sourceMappingURL=resolve.d.ts.map