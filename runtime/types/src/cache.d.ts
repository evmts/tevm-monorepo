import type { SolcInputDescription, SolcOutput } from './solc/solc';
import type { Cache } from './types';
export declare const readCache: <TIncludeAsts extends boolean>(cache: Cache<TIncludeAsts>, entryModuleId: string, sources: SolcInputDescription['sources']) => SolcOutput | undefined;
