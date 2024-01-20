/**
 * The base bundler instance used within tevm to generate JavaScript and TypeScript files
 * from solidity files. This is used internally by all other tevm build tooling including
 * the ts-plugin, the webpack plugin, the bun plugin, the vite plugin, and more.
 * @param config - The tevm config. Can be loaded with `loadConfig()`
 * @param logger - The logger to use for logging. Can be `console`
 * @param fao - The file access object to use for reading and writing files. Can use fs to fill this out
 * @param solc - The solc compiler to use. Can be loaded with `createSolc()`
 * @param cache - The cache to use. Can be created with `createCache()`
 * @type {import('./types.js').Bundler}
 *
 * Since ts-plugin must be synchronous, this bundler supports both async and sync methods.
 *
 * To use initialize the bundler and then call a resolve* methods
 *
 * @example
 * ```typescript
 * import { bundler } from '@tevm/base-bundler-bundler'
 * import { createCache } from '@tevm/bundler-cache'
 * import { readFile, writeFile } from 'fs/promises'
 * import { readFileSync, writeFileSync, existsSync } from 'fs'
 * import { createSolc } from '@tevm/solc'
 * import { loadConfig } from '@tevm/config'
 *
 * const fao = {
 *   readFile,
 *   writeFile,
 *   readFileSync,
 *   writeFileSync,
 *   existsSync,
 *   // may need more methods
 * }
 *
 * const b = bundler(await loadConfig(), console, fao, await createSolc(), createCache())
 *
 * const path = '../contracts/ERC20.sol'
 *
 * const { abi, bytecode } = await b.resolveTs(path, __dirname, true, true)
 * ```
 */
export const bundler: import('./types.js').Bundler;
//# sourceMappingURL=bundler.d.ts.map