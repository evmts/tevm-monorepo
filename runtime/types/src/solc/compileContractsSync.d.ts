/**
 * Compile the Solidity contract and return its ABI.
 *
 * @template TIncludeAsts
 * @param {string} filePath
 * @param {string} basedir
 * @param {import('@evmts/config').ResolvedCompilerConfig} config
 * @param {TIncludeAsts} includeAst
 * @param {import('../types.js').FileAccessObject} fao
 * @param {import('../types.js').Logger} logger
 * @param {import('../createCache.js').Cache} [cache]
 * @returns {import('../types.js').CompiledContracts}
 * @example
 * const { artifacts, modules } = compileContractSync(
 *  './contracts/MyContract.sol',
 *  __dirname,
 *  config,
 *  true,
 *  await import('fs'),
 *  logger,
 *  cache,
 *  )
 */
export function compileContractSync<TIncludeAsts>(filePath: string, basedir: string, config: import('@evmts/config').ResolvedCompilerConfig, includeAst: TIncludeAsts, fao: import('../types.js').FileAccessObject, logger: import('../types.js').Logger, cache?: import("../createCache.js").Cache | undefined): import('../types.js').CompiledContracts;
