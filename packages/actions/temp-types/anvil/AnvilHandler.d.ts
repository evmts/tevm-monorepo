import type { AnvilDealParams, AnvilDropTransactionParams, AnvilDumpStateParams, AnvilGetAutomineParams, AnvilImpersonateAccountParams, AnvilLoadStateParams, AnvilMineParams, AnvilResetParams, AnvilSetBalanceParams, AnvilSetChainIdParams, AnvilSetCodeParams, AnvilSetNonceParams, AnvilSetStorageAtParams, AnvilStopImpersonatingAccountParams } from './AnvilParams.js';
import type { AnvilDealResult, AnvilDropTransactionResult, AnvilDumpStateResult, AnvilGetAutomineResult, AnvilImpersonateAccountResult, AnvilLoadStateResult, AnvilMineResult, AnvilResetResult, AnvilSetBalanceResult, AnvilSetChainIdResult, AnvilSetCodeResult, AnvilSetNonceResult, AnvilSetStorageAtResult, AnvilStopImpersonatingAccountResult } from './AnvilResult.js';
export type AnvilImpersonateAccountHandler = (params: AnvilImpersonateAccountParams) => Promise<AnvilImpersonateAccountResult>;
export type AnvilStopImpersonatingAccountHandler = (params: AnvilStopImpersonatingAccountParams) => Promise<AnvilStopImpersonatingAccountResult>;
export type AnvilGetAutomineHandler = (params: AnvilGetAutomineParams) => Promise<AnvilGetAutomineResult>;
export type AnvilMineHandler = (params: AnvilMineParams) => Promise<AnvilMineResult>;
export type AnvilResetHandler = (params: AnvilResetParams) => Promise<AnvilResetResult>;
export type AnvilDropTransactionHandler = (params: AnvilDropTransactionParams) => Promise<AnvilDropTransactionResult>;
export type AnvilSetBalanceHandler = (params: AnvilSetBalanceParams) => Promise<AnvilSetBalanceResult>;
export type AnvilSetCodeHandler = (params: AnvilSetCodeParams) => Promise<AnvilSetCodeResult>;
export type AnvilSetNonceHandler = (params: AnvilSetNonceParams) => Promise<AnvilSetNonceResult>;
export type AnvilSetStorageAtHandler = (params: AnvilSetStorageAtParams) => Promise<AnvilSetStorageAtResult>;
export type AnvilSetChainIdHandler = (params: AnvilSetChainIdParams) => Promise<AnvilSetChainIdResult>;
export type AnvilDumpStateHandler = (params: AnvilDumpStateParams) => Promise<AnvilDumpStateResult>;
export type AnvilLoadStateHandler = (params: AnvilLoadStateParams) => Promise<AnvilLoadStateResult>;
export type AnvilDealHandler = (params: AnvilDealParams) => Promise<AnvilDealResult>;
//# sourceMappingURL=AnvilHandler.d.ts.map