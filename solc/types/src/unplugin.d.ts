/**
 * @type {import("unplugin").UnpluginFactory<{compiler?: CompilerOption } | undefined, false>}
 */
export const unpluginFn: import("unplugin").UnpluginFactory<{
    compiler?: CompilerOption;
} | undefined, false>;
export const vitePluginEvmts: (options?: {
    compiler?: CompilerOption;
} | undefined) => import("rollup").Plugin<any>;
export const rollupPluginEvmts: (options?: {
    compiler?: CompilerOption;
} | undefined) => import("rollup").Plugin<any>;
export const esbuildPluginEvmts: (options?: {
    compiler?: CompilerOption;
} | undefined) => import("esbuild").Plugin;
export const webpackPluginEvmts: (options?: {
    compiler?: CompilerOption;
} | undefined) => RspackPluginInstance;
export const rspackPluginEvmts: (options?: {
    compiler?: CompilerOption;
} | undefined) => RspackPluginInstance;
export type CompilerOption = import("zod").infer<typeof compilerOptionValidator>;
declare const compilerOptionValidator: z.ZodDefault<z.ZodEnum<["solc", "foundry"]>>;
import { z } from 'zod';
export {};
