/// <reference types="node" resolution-mode="require"/>
import type { Cache } from './createCache.js';
import type { SolcInputDescription, SolcOutput } from './solc/solcTypes.js';
import type { ResolvedCompilerConfig } from '@evmts/config';
import type { Node } from 'solidity-ast/node.js';
export type BundlerResult = {
    code: string;
    modules: Record<'string', ModuleInfo>;
    solcInput: SolcInputDescription;
    solcOutput: SolcOutput;
    asts?: Record<string, Node> | undefined;
};
export type FileAccessObject = {
    readFile: (path: string, encoding: BufferEncoding) => Promise<string>;
    readFileSync: (path: string, encoding: BufferEncoding) => string;
    existsSync: (path: string) => boolean;
};
export type AsyncBundlerResult = (module: string, basedir: string, includeAst: boolean) => Promise<BundlerResult>;
export type SyncBundlerResult = (module: string, basedir: string, includeAst: boolean) => BundlerResult;
export type Bundler = (config: ResolvedCompilerConfig, logger: Logger, fao: FileAccessObject, cache?: Cache) => {
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
    resolveDts: AsyncBundlerResult;
    /**
     * Resolves .d.ts representation of the solidity module
     */
    resolveDtsSync: SyncBundlerResult;
    /**
     * Resolves typescript representation of the solidity module
     */
    resolveTsModule: AsyncBundlerResult;
    /**
     * Resolves typescript representation of the solidity module
     */
    resolveTsModuleSync: SyncBundlerResult;
    /**
     * Resolves cjs representation of the solidity module
     */
    resolveCjsModule: AsyncBundlerResult;
    /**
     * Resolves cjs representation of the solidity module
     */
    resolveCjsModuleSync: SyncBundlerResult;
    /**
     * Resolves the esm representation of the solidity module
     */
    resolveEsmModule: AsyncBundlerResult;
    /**
     * Resolves the esm representation of the solidity module
     */
    resolveEsmModuleSync: SyncBundlerResult;
};
export type Logger = {
    info: (...messages: string[]) => void;
    error: (...message: string[]) => void;
    warn: (...message: string[]) => void;
    log: (...message: string[]) => void;
};
/**
 * Copied from rollup (kinda)
 * @see https://rollupjs.org/plugin-development/#this-getmoduleinfo
 */
export interface ModuleInfo {
    id: string;
    rawCode: string | null;
    code: string | null;
    importedIds: string[];
    resolutions: ModuleInfo[];
}
export type SolidityResolver = (config: ResolvedCompilerConfig, logger: Logger) => {
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
    resolveDts: (module: string, basedir: string) => Promise<BundlerResult>;
    /**
     * Resolves .d.ts representation of the solidity module
     */
    resolveDtsSync: (module: string, basedir: string) => BundlerResult;
    /**
     * Resolves typescript representation of the solidity module
     */
    resolveTsModule: (module: string, basedir: string) => Promise<BundlerResult>;
    /**
     * Resolves typescript representation of the solidity module
     */
    resolveTsModuleSync: (module: string, basedir: string) => BundlerResult;
    /**
     * Resolves cjs representation of the solidity module
     */
    resolveCjsModule: (module: string, basedir: string) => Promise<BundlerResult>;
    /**
     * Resolves cjs representation of the solidity module
     */
    resolveCjsModuleSync: (module: string, basedir: string) => BundlerResult;
    /**
     * Resolves the esm representation of the solidity module
     */
    resolveEsmModule: (module: string, basedir: string) => Promise<BundlerResult>;
    /**
     * Resolves the esm representation of the solidity module
     */
    resolveEsmModuleSync: (module: string, basedir: string) => BundlerResult;
};
export type CompiledContracts<TIncludeAsts extends boolean = boolean> = {
    artifacts: SolcOutput['contracts'][string] | undefined;
    modules: Record<'string', ModuleInfo>;
    asts: TIncludeAsts extends true ? Record<string, Node> : undefined;
    solcInput: SolcInputDescription;
    solcOutput: SolcOutput;
};
