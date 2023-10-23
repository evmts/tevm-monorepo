export function compileContract<TIncludeAsts>(filePath: string, basedir: string, config: import('@evmts/config').ResolvedCompilerConfig, includeAst: TIncludeAsts, fao: import('../types.js').FileAccessObject, logger: import('../types.js').Logger, cache?: import("../createCache.js").Cache | undefined): Promise<import("../types.js").CompiledContracts<TIncludeAsts>>;
