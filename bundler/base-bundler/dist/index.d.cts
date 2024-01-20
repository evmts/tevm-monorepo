import { Cache } from '@tevm/bundler-cache';
import { ModuleInfo } from '@tevm/compiler';
import { ResolvedCompilerConfig } from '@tevm/config';
import { SolcInputDescription, SolcOutput } from '@tevm/solc';
import { statSync, mkdirSync } from 'fs';
import { writeFile, stat, mkdir } from 'fs/promises';
import { Node } from 'solidity-ast/node.js';

type BundlerResult$1 = {
    code: string;
    modules: Record<'string', ModuleInfo>;
    solcInput: SolcInputDescription;
    solcOutput: SolcOutput;
    asts?: Record<string, Node> | undefined;
};
/**
 * Generalized interface for accessing file system
 * Allows this package to be used in browser environments or otherwise pluggable
 */
type FileAccessObject$1 = {
    writeFileSync: (path: string, data: string) => void;
    writeFile: typeof writeFile;
    readFile: (path: string, encoding: BufferEncoding) => Promise<string>;
    readFileSync: (path: string, encoding: BufferEncoding) => string;
    exists: (path: string) => Promise<boolean>;
    existsSync: (path: string) => boolean;
    statSync: typeof statSync;
    stat: typeof stat;
    mkdirSync: typeof mkdirSync;
    mkdir: typeof mkdir;
};
type AsyncBundlerResult$1 = (module: string, basedir: string, includeAst: boolean, includeBytecode: boolean) => Promise<BundlerResult$1>;
type SyncBundlerResult$1 = (module: string, basedir: string, includeAst: boolean, includeBytecode: boolean) => BundlerResult$1;
type Bundler$1 = (config: ResolvedCompilerConfig, logger: Logger$1, fao: FileAccessObject$1, solc: any, cache: Cache) => {
    /**
     * The name of the plugin.
     */
    name: string;
    /**
     * The configuration of the plugin.
     */
    config: ResolvedCompilerConfig;
    include?: string[];
    exclude?: string[];
    /**
     * Resolves .d.ts representation of the solidity module
     */
    resolveDts: AsyncBundlerResult$1;
    /**
     * Resolves .d.ts representation of the solidity module
     */
    resolveDtsSync: SyncBundlerResult$1;
    /**
     * Resolves typescript representation of the solidity module
     */
    resolveTsModule: AsyncBundlerResult$1;
    /**
     * Resolves typescript representation of the solidity module
     */
    resolveTsModuleSync: SyncBundlerResult$1;
    /**
     * Resolves cjs representation of the solidity module
     */
    resolveCjsModule: AsyncBundlerResult$1;
    /**
     * Resolves cjs representation of the solidity module
     */
    resolveCjsModuleSync: SyncBundlerResult$1;
    /**
     * Resolves the esm representation of the solidity module
     */
    resolveEsmModule: AsyncBundlerResult$1;
    /**
     * Resolves the esm representation of the solidity module
     */
    resolveEsmModuleSync: SyncBundlerResult$1;
};
type Logger$1 = {
    info: (...messages: string[]) => void;
    error: (...message: string[]) => void;
    warn: (...message: string[]) => void;
    log: (...message: string[]) => void;
};
type SolidityResolver$1 = (config: ResolvedCompilerConfig, logger: Logger$1) => {
    /**
     * The name of the plugin.
     */
    name: string;
    /**
     * The configuration of the plugin.
     */
    config: ResolvedCompilerConfig;
    include?: string[];
    exclude?: string[];
    /**
     * Resolves .d.ts representation of the solidity module
     */
    resolveDts: (module: string, basedir: string) => Promise<BundlerResult$1>;
    /**
     * Resolves .d.ts representation of the solidity module
     */
    resolveDtsSync: (module: string, basedir: string) => BundlerResult$1;
    /**
     * Resolves typescript representation of the solidity module
     */
    resolveTsModule: (module: string, basedir: string) => Promise<BundlerResult$1>;
    /**
     * Resolves typescript representation of the solidity module
     */
    resolveTsModuleSync: (module: string, basedir: string) => BundlerResult$1;
    /**
     * Resolves cjs representation of the solidity module
     */
    resolveCjsModule: (module: string, basedir: string) => Promise<BundlerResult$1>;
    /**
     * Resolves cjs representation of the solidity module
     */
    resolveCjsModuleSync: (module: string, basedir: string) => BundlerResult$1;
    /**
     * Resolves the esm representation of the solidity module
     */
    resolveEsmModule: (module: string, basedir: string) => Promise<BundlerResult$1>;
    /**
     * Resolves the esm representation of the solidity module
     */
    resolveEsmModuleSync: (module: string, basedir: string) => BundlerResult$1;
};

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
declare const bundler: Bundler$1;

/**
 * ./types.ts
 */
type AsyncBundlerResult = AsyncBundlerResult$1;
/**
 * ./types.ts
 */
type Bundler = Bundler$1;
/**
 * ./types.ts
 */
type BundlerResult = BundlerResult$1;
/**
 * ./types.ts
 */
type FileAccessObject = FileAccessObject$1;
/**
 * ./types.ts
 */
type Logger = Logger$1;
/**
 * ./types.ts
 */
type SolidityResolver = SolidityResolver$1;
/**
 * ./types.ts
 */
type SyncBundlerResult = SyncBundlerResult$1;

export { type AsyncBundlerResult, type Bundler, type BundlerResult, type FileAccessObject, type Logger, type SolidityResolver, type SyncBundlerResult, bundler };
