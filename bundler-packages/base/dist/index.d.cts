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
 * @type {import('./types.js').Bundler}
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
