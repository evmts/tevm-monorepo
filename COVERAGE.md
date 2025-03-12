## @tevm/actions

```bash
pnpm --filter @tevm/actions run test:coverage
```

% Coverage report from v8
-----------------------------------------------------|---------|----------|---------|---------|--------------------------------------------------------
File | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s  
-----------------------------------------------------|---------|----------|---------|---------|--------------------------------------------------------
All files | 91.53 | 83.17 | 98.63 | 91.53 |  
 src | 100 | 77.27 | 100 | 100 |  
 createHandlers.js | 100 | 77.77 | 100 | 100 | 112,124  
 requestBulkProcedure.js | 100 | 75 | 100 | 100 | 21-22  
 requestProcedure.js | 100 | 80 | 100 | 100 | 37  
 src/BaseCall | 100 | 100 | 100 | 100 |  
 validateBaseCallParams.js | 100 | 100 | 100 | 100 |  
 zBaseCallParams.js | 100 | 100 | 100 | 100 |  
 zBaseParams.js | 100 | 100 | 100 | 100 |  
 src/Call | 99.15 | 88.7 | 100 | 99.15 |  
 callHandler.js | 95.63 | 81.94 | 100 | 95.63 | 124-132  
 callHandlerOpts.js | 100 | 96.2 | 100 | 100 | 49,53,84  
 callHandlerResult.js | 100 | 95.83 | 100 | 100 | 60  
 callProcedure.js | 100 | 75 | 100 | 100 | 19,21-23,32,34,43,46-48,51-54,61-63,78,104,108,111-117
cloneVmWithBlock.js | 100 | 80 | 100 | 100 | 22,29  
 executeCall.js | 100 | 94.73 | 100 | 100 | 65,105  
 handleAutomining.js | 100 | 100 | 100 | 100 |  
 handleEvmError.js | 100 | 100 | 100 | 100 |  
 handlePendingTransactionsWarning.js | 100 | 90 | 100 | 100 | 31  
 handleStateOverrides.js | 100 | 94.11 | 100 | 100 | 22  
 handleTransactionCreation.js | 100 | 100 | 100 | 100 |  
 shouldCreateTransaction.js | 100 | 100 | 100 | 100 |  
 validateCallParams.js | 100 | 100 | 100 | 100 |  
 zCallParams.js | 100 | 100 | 100 | 100 |  
 src/Contract | 89.94 | 88.23 | 100 | 89.94 |  
 contractHandler.js | 75.15 | 73.07 | 100 | 75.15 | 107-127,144-162  
 createScript.js | 100 | 90.9 | 100 | 100 | 56,63,125  
 validateContractParams.js | 100 | 100 | 100 | 100 |  
 zContractParams.js | 100 | 100 | 100 | 100 |  
 src/CreateTransaction | 95.53 | 75.51 | 100 | 95.53 |  
 createTransaction.js | 95.53 | 75.51 | 100 | 95.53 | 75-76,134-138,180  
 src/Deploy | 75.51 | 70 | 100 | 75.51 |  
 deployHandler.js | 75.51 | 70 | 100 | 75.51 | 78-101  
 src/DumpState | 76.47 | 63.15 | 100 | 76.47 |  
 dumpStateHandler.js | 80 | 53.84 | 100 | 80 | 38-42,49-57  
 dumpStateProcedure.js | 71.42 | 83.33 | 100 | 71.42 | 31-44  
 src/GetAccount | 79.58 | 76.31 | 75 | 79.58 |  
 getAccountHandler.js | 69.49 | 85 | 50 | 69.49 | 50-74,76-104  
 getAccountProcedure.js | 100 | 58.33 | 100 | 100 | 28,35-45  
 validateGetAccountParams.js | 89.79 | 83.33 | 100 | 89.79 | 44-47,49  
 zGetAccountParams.js | 100 | 100 | 100 | 100 |  
 src/LoadState | 90.96 | 88.88 | 100 | 90.96 |  
 loadStateHandler.js | 100 | 100 | 100 | 100 |  
 loadStateProcedure.js | 72.54 | 60 | 100 | 72.54 | 35-48  
 validateLoadStateParams.js | 97.72 | 100 | 100 | 97.72 | 39  
 zLoadStateParams.js | 100 | 100 | 100 | 100 |  
 src/Mine | 97.3 | 92.64 | 100 | 97.3 |  
 emitEvents.js | 100 | 100 | 100 | 100 |  
 mineHandler.js | 94.28 | 93.33 | 100 | 94.28 | 130-137  
 mineProcedure.js | 100 | 80 | 100 | 100 | 28,40,46  
 processTx.js | 100 | 100 | 100 | 100 |  
 validateMineParams.js | 100 | 100 | 100 | 100 |  
 zMineParams.js | 100 | 100 | 100 | 100 |  
 src/SetAccount | 97.84 | 92.2 | 100 | 97.84 |  
 setAccountHandler.js | 97.9 | 94.73 | 100 | 97.9 | 94-96  
 setAccountProcedure.js | 100 | 83.33 | 100 | 100 | 16-17,32  
 validateSetAccountParams.js | 98.41 | 100 | 100 | 98.41 | 30  
 zSetAccountParams.js | 93.93 | 66.66 | 100 | 93.93 | 28-29  
 src/anvil | 92.32 | 86.51 | 100 | 92.32 |  
 anvilDealHandler.js | 96.22 | 80 | 100 | 96.22 | 43-44  
 anvilDealProcedure.js | 70.58 | 57.14 | 100 | 70.58 | 33-47  
 anvilDropTransactionProcedure.js | 100 | 100 | 100 | 100 |  
 anvilDumpStateProcedure.js | 100 | 100 | 100 | 100 |  
 anvilGetAutomineProcedure.js | 100 | 100 | 100 | 100 |  
 anvilImpersonateAccountProcedure.js | 100 | 66.66 | 100 | 100 | 15,22  
 anvilLoadStateProcedure.js | 71.42 | 80 | 100 | 71.42 | 36-49  
 anvilResetProcedure.js | 100 | 75 | 100 | 100 | 54  
 anvilSetBalanceProcedure.js | 100 | 88.88 | 100 | 100 | 26  
 anvilSetChainIdProcedure.js | 71.42 | 66.66 | 100 | 71.42 | 13-22  
 anvilSetCodeProcedure.js | 100 | 100 | 100 | 100 |  
 anvilSetCoinbaseProcedure.js | 100 | 66.66 | 100 | 100 | 43  
 anvilSetNonceProcedure.js | 100 | 88.88 | 100 | 100 | 26  
 anvilSetStorageAtProcedure.js | 100 | 100 | 100 | 100 |  
 anvilStopImpersonatingAccountProcedure.js | 100 | 100 | 100 | 100 |  
 src/common | 100 | 100 | 100 | 100 |  
 zCallEvents.js | 100 | 100 | 100 | 100 |  
 src/debug | 82.64 | 58.49 | 100 | 82.64 |  
 debugTraceCallProcedure.js | 100 | 95.45 | 100 | 100 | 18  
 debugTraceTransactionProcedure.js | 74.23 | 15.78 | 100 | 74.23 | 64-65,73-79,91,93-103,109-121,153-160  
 traceCallHandler.js | 100 | 58.33 | 100 | 100 | 22-24,26-27  
 src/eth | 85.65 | 74.7 | 98.3 | 85.65 |  
 blockNumberHandler.js | 100 | 100 | 100 | 100 |  
 blockNumberProcedure.js | 100 | 100 | 100 | 100 |  
 chainIdHandler.js | 100 | 100 | 100 | 100 |  
 chainIdProcedure.js | 100 | 100 | 100 | 100 |  
 ethAccountsHandler.js | 100 | 100 | 100 | 100 |  
 ethAccountsProcedure.js | 100 | 100 | 100 | 100 |  
 ethBlobBaseFeeProcedure.js | 100 | 100 | 100 | 100 |  
 ethCallHandler.js | 88.23 | 60 | 100 | 88.23 | 14-15  
 ethCallProcedure.js | 83.33 | 62.5 | 100 | 83.33 | 30-36  
 ethCoinbaseProcedure.js | 100 | 100 | 100 | 100 |  
 ethCreateAccessListProcedure.js | 79.62 | 21.42 | 100 | 79.62 | 31-41  
 ethEstimateGasProcedure.js | 100 | 85.71 | 100 | 100 | 24,45  
 ethGetBlockByHashProcedure.js | 100 | 80 | 100 | 100 | 13  
 ethGetBlockByNumberProcedure.js | 64.51 | 76.92 | 100 | 64.51 | 22-43  
 ethGetBlockTransactionCountByHashProcedure.js | 100 | 100 | 100 | 100 |  
 ethGetBlockTransactionCountByNumberProcedure.js | 69.44 | 71.42 | 100 | 69.44 | 16,19-28  
 ethGetFilterChangesProcedure.js | 100 | 73.33 | 100 | 100 | 17,33,57,72  
 ethGetFilterLogsProcedure.js | 68.25 | 37.5 | 100 | 68.25 | 13-22,53-62  
 ethGetLogsHandler.js | 92.3 | 80.64 | 100 | 92.3 | 22-23,49-54,73-74  
 ethGetLogsProcedure.js | 75.6 | 83.33 | 100 | 75.6 | 32-41  
 ethGetTransactionByBlockHashAndIndexProcedure.js | 100 | 60 | 100 | 100 | 17-30  
 ethGetTransactionByBlockNumberAndIndexProcedure.js | 77.55 | 50 | 100 | 77.55 | 17,20-29  
 ethGetTransactionByHashProcedure.js | 100 | 70.58 | 100 | 100 | 19,25-32,40,54  
 ethGetTransactionCountProcedure.js | 78.09 | 62.5 | 100 | 78.09 | 17-18,23-25,46-49,76-88,104  
 ethGetTransactionReceipt.js | 92.94 | 90.24 | 100 | 92.94 | 10-11,155-163  
 ethGetTransactionReceiptProcedure.js | 62.9 | 62.5 | 100 | 62.9 | 12-25,47-55  
 ethNewBlockFilterProcedure.js | 95.12 | 60 | 100 | 95.12 | 20-21  
 ethNewFilterHandler.js | 72.81 | 47.05 | 100 | 72.81 | 31,35-41,45-46,49-50,59-60,77-90  
 ethNewFilterProcedure.js | 100 | 85.71 | 100 | 100 | 28  
 ethNewPendingTransactionFilterProcedure.js | 95 | 83.33 | 100 | 95 | 18-19  
 ethProtocolVersionProcedure.js | 100 | 100 | 100 | 100 |  
 ethSendRawTransactionHandler.js | 64.44 | 56 | 66.66 | 64.44 | 23-37,54-67,69,102-113,131-135,138-139,141-142  
 ethSendRawTransactionProcedure.js | 72.5 | 40 | 100 | 72.5 | 21-31  
 ethSendTransactionHandler.js | 80.76 | 33.33 | 100 | 80.76 | 23-28,48-49,51-52  
 ethSendTransactionProcedure.js | 100 | 22.22 | 100 | 100 | 15-26  
 ethSignHandler.js | 100 | 100 | 100 | 100 |  
 ethSignProcedure.js | 100 | 75 | 100 | 100 | 8  
 ethSignTransactionHandler.js | 100 | 100 | 100 | 100 |  
 ethSignTransactionProcedure.js | 100 | 100 | 100 | 100 |  
 ethUninstallFilterProcedure.js | 89.18 | 80 | 100 | 89.18 | 26-29  
 gasPriceHandler.js | 100 | 90 | 100 | 100 | 25  
 gasPriceProcedure.js | 100 | 100 | 100 | 100 |  
 getBalanceHandler.js | 72.85 | 86.95 | 100 | 72.85 | 34-35,57-73  
 getBalanceProcedure.js | 100 | 88.88 | 100 | 100 | 22  
 getCodeHandler.js | 76.38 | 86.95 | 100 | 76.38 | 17-18,33-34,57-64,68-72  
 getCodeProcedure.js | 100 | 100 | 100 | 100 |  
 getStorageAtHandler.js | 88.23 | 80 | 100 | 88.23 | 17-18,33-34  
 getStorageAtProcedure.js | 100 | 100 | 100 | 100 |  
 src/eth/utils | 100 | 100 | 100 | 100 |  
 generateRandomId.js | 100 | 100 | 100 | 100 |  
 parseBlockParam.js | 100 | 100 | 100 | 100 |  
 parseBlockTag.js | 100 | 100 | 100 | 100 |  
 testAccounts.js | 100 | 100 | 100 | 100 |  
 src/internal | 97.64 | 94.5 | 100 | 97.64 |  
 createEvmError.js | 100 | 100 | 100 | 100 |  
 evmInputToImpersonatedTx.js | 100 | 94.11 | 100 | 100 | 29  
 forkAndCacheBlock.js | 80.76 | 85.71 | 100 | 80.76 | 46-56  
 getL1FeeInformationOpStack.js | 100 | 66.66 | 100 | 100 | 24  
 getPendingClient.js | 100 | 100 | 100 | 100 |  
 maybeThrowOnFail.js | 100 | 94.11 | 100 | 100 | 19  
 runCallWithTrace.js | 100 | 87.5 | 100 | 100 | 39  
 src/internal/zod | 100 | 100 | 100 | 100 |  
 index.js | 100 | 100 | 100 | 100 |  
 zAbi.js | 100 | 100 | 100 | 100 |  
 zAddress.js | 100 | 100 | 100 | 100 |  
 zBlock.js | 100 | 100 | 100 | 100 |  
 zBlockOverrideSet.js | 100 | 100 | 100 | 100 |  
 zBlockParam.js | 100 | 100 | 100 | 100 |  
 zBytecode.js | 100 | 100 | 100 | 100 |  
 zHex.js | 100 | 100 | 100 | 100 |  
 zStateOverrideSet.js | 100 | 100 | 100 | 100 |  
 zStorageRoot.js | 100 | 100 | 100 | 100 |  
 src/utils | 100 | 79.31 | 100 | 100 |  
 blockToJsonRpcBlock.js | 100 | 57.14 | 100 | 100 | 50-55  
 generateRandomId.js | 100 | 100 | 100 | 100 |  
 isArray.js | 100 | 100 | 100 | 100 |  
 parseBlockTag.js | 100 | 100 | 100 | 100 |  
 txToJsonRpcTx.js | 100 | 80 | 100 | 100 | 30-32  
-----------------------------------------------------|---------|----------|---------|---------|--------------------------------------------------------
error: script "test:coverage" exited with code 1
➜ actions git:(main)

## @tevm/address

```bash
pnpm --filter @tevm/address run test:coverage
```

% Coverage report from v8
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------|---------|----------|---------|---------|-------------------
All files          |     100 |      100 |     100 |     100 |                   
 Address.js        |     100 |      100 |     100 |     100 |                   
 ...ractAddress.js |     100 |      100 |     100 |     100 |                   
 createAddress.js  |     100 |      100 |     100 |     100 |                   
 ...ractAddress.js |     100 |      100 |     100 |     100 |                   
-------------------|---------|----------|---------|---------|-------------------

## @tevm/block

```bash
pnpm --filter @tevm/block run test:coverage
```

% Coverage report from v8
----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
----------|---------|----------|---------|---------|-------------------
All files |       0 |        0 |       0 |       0 |                   
----------|---------|----------|---------|---------|-------------------

## @tevm/blockchain

```bash
pnpm --filter @tevm/blockchain run test:coverage
```

% Coverage report from v8
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------|---------|----------|---------|---------|-------------------
All files          |     100 |    98.57 |     100 |     100 |                   
 src               |     100 |     87.5 |     100 |     100 |                   
  ...eBaseChain.js |     100 |    81.81 |     100 |     100 | 39-42             
  createChain.js   |     100 |      100 |     100 |     100 |                   
 src/actions       |     100 |      100 |     100 |     100 |                   
  deepCopy.js      |     100 |      100 |     100 |     100 |                   
  delBlock.js      |     100 |      100 |     100 |     100 |                   
  getBlock.js      |     100 |      100 |     100 |     100 |                   
  getBlockByTag.js |     100 |      100 |     100 |     100 |                   
  ...lHeadBlock.js |     100 |      100 |     100 |     100 |                   
  ...eratorHead.js |     100 |      100 |     100 |     100 |                   
  putBlock.js      |     100 |      100 |     100 |     100 |                   
  ...eratorHead.js |     100 |      100 |     100 |     100 |                   
  shallowCopy.js   |     100 |      100 |     100 |     100 |                   
  ...dateHeader.js |     100 |      100 |     100 |     100 |                   
 src/utils         |     100 |      100 |     100 |     100 |                   
  ...M_Tx_TYPES.js |     100 |      100 |     100 |     100 |                   
  ...ockFromRpc.js |     100 |      100 |     100 |     100 |                   
  ...vmBlockTag.js |     100 |      100 |     100 |     100 |                   
  warnOnce.js      |     100 |      100 |     100 |     100 |                   
-------------------|---------|----------|---------|---------|-------------------

## @tevm/common

```bash
pnpm --filter @tevm/common run test:coverage
```

% Coverage report from v8
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------|---------|----------|---------|---------|-------------------
All files          |   96.08 |    92.85 |    90.9 |   96.08 |                   
 src               |     100 |      100 |     100 |     100 |                   
  createCommon.js  |     100 |      100 |     100 |     100 |                   
  createMockKzg.js |     100 |      100 |     100 |     100 |                   
 src/presets       |   96.03 |        0 |       0 |   96.03 |                   
  ..._PRESETS__.js |       0 |        0 |       0 |       0 | 1-408             
  ...actTestnet.js |     100 |      100 |     100 |     100 |                   
  acala.js         |     100 |      100 |     100 |     100 |                   
  ancient8.js      |     100 |      100 |     100 |     100 |                   
  ...nt8Sepolia.js |     100 |      100 |     100 |     100 |                   
  anvil.js         |     100 |      100 |     100 |     100 |                   
  apexTestnet.js   |     100 |      100 |     100 |     100 |                   
  arbitrum.js      |     100 |      100 |     100 |     100 |                   
  ...trumGoerli.js |     100 |      100 |     100 |     100 |                   
  arbitrumNova.js  |     100 |      100 |     100 |     100 |                   
  ...rumSepolia.js |     100 |      100 |     100 |     100 |                   
  areonNetwork.js  |     100 |      100 |     100 |     100 |                   
  ...orkTestnet.js |     100 |      100 |     100 |     100 |                   
  artelaTestnet.js |     100 |      100 |     100 |     100 |                   
  ...ainTestnet.js |     100 |      100 |     100 |     100 |                   
  [... many more chain configs ...]                
-------------------|---------|----------|---------|---------|-------------------

## @tevm/contract

```bash
pnpm --filter @tevm/contract run test:coverage
```

% Coverage report from v8
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------|---------|----------|---------|---------|-------------------
All files          |     100 |      100 |     100 |     100 |                   
 src               |     100 |      100 |     100 |     100 |                   
  ...teContract.js |     100 |      100 |     100 |     100 |                   
 src/event         |     100 |      100 |     100 |     100 |                   
  eventFactory.js  |     100 |      100 |     100 |     100 |                   
 src/read          |     100 |      100 |     100 |     100 |                   
  readFactory.js   |     100 |      100 |     100 |     100 |                   
 src/write         |     100 |      100 |     100 |     100 |                   
  writeFactory.js  |     100 |      100 |     100 |     100 |                   
-------------------|---------|----------|---------|---------|-------------------

## @tevm/decorators

```bash
pnpm --filter @tevm/decorators run test:coverage
```

% Coverage report from v8
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------|---------|----------|---------|---------|-------------------
All files          |     100 |    97.29 |     100 |     100 |                   
 src               |     100 |      100 |     100 |     100 |                   
  index.js         |     100 |      100 |     100 |     100 |                   
 src/actions       |     100 |    96.29 |     100 |     100 |                   
  ethActions.js    |     100 |    85.71 |     100 |     100 | 24                
  index.js         |     100 |      100 |     100 |     100 |                   
  tevmActions.js   |     100 |      100 |     100 |     100 |                   
 src/request       |     100 |      100 |     100 |     100 |                   
  index.js         |     100 |      100 |     100 |     100 |                   
  ...estEip1193.js |     100 |      100 |     100 |     100 |                   
  tevmSend.js      |     100 |      100 |     100 |     100 |                   
-------------------|---------|----------|---------|---------|-------------------

## @tevm/evm

```bash
pnpm --filter @tevm/evm run test:coverage
```

% Coverage report from v8
--------------|---------|----------|---------|---------|-------------------
File          | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
--------------|---------|----------|---------|---------|-------------------
All files     |     100 |    89.47 |     100 |     100 |                   
 Evm.js       |     100 |      100 |     100 |     100 |                   
 createEvm.js |     100 |       80 |     100 |     100 | 69-70             
--------------|---------|----------|---------|---------|-------------------

## @tevm/state

```bash
pnpm --filter @tevm/state run test:coverage
```

% Coverage report from v8
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------|---------|----------|---------|---------|-------------------
All files          |   99.91 |     98.2 |   98.24 |   99.91 |                   
 src               |     100 |      100 |      95 |     100 |                   
  ContractCache.js |     100 |      100 |     100 |     100 |                   
  ...eBaseState.js |     100 |      100 |     100 |     100 |                   
  ...ateManager.js |     100 |      100 |      80 |     100 |                   
  index.js         |     100 |      100 |     100 |     100 |                   
 src/actions       |   99.89 |    97.78 |     100 |   99.89 |                   
  checkpoint.js    |     100 |      100 |     100 |     100 |                   
  clearCaches.js   |     100 |      100 |     100 |     100 |                   
  ...actStorage.js |     100 |      100 |     100 |     100 |                   
  commit.js        |     100 |       90 |     100 |     100 | 35                
  deepCopy.js      |     100 |      100 |     100 |     100 |                   
  deleteAccount.js |     100 |      100 |     100 |     100 |                   
  ...calGenesis.js |     100 |    85.71 |     100 |     100 | 23                
  dumpStorage.js   |     100 |      100 |     100 |     100 |                   
  ...orageRange.js |     100 |      100 |     100 |     100 |                   
  ...calGenesis.js |   98.33 |    81.25 |     100 |   98.33 | 53                
  getAccount.js    |     100 |      100 |     100 |     100 |                   
  ...tAddresses.js |     100 |      100 |     100 |     100 |                   
  ...omProvider.js |     100 |      100 |     100 |     100 |                   
  getAppliedKey.js |     100 |      100 |     100 |     100 |                   
  ...ntractCode.js |     100 |      100 |     100 |     100 |                   
  ...actStorage.js |     100 |      100 |     100 |     100 |                   
  ...rkBlockTag.js |     100 |      100 |     100 |     100 |                   
  getForkClient.js |     100 |      100 |     100 |     100 |                   
  getProof.js      |     100 |      100 |     100 |     100 |                   
  getStateRoot.js  |     100 |      100 |     100 |     100 |                   
  hasStateRoot.js  |     100 |      100 |     100 |     100 |                   
  index.js         |     100 |      100 |     100 |     100 |                   
  ...ountFields.js |     100 |      100 |     100 |     100 |                   
  ...orageCache.js |     100 |      100 |     100 |     100 |                   
  putAccount.js    |     100 |      100 |     100 |     100 |                   
  ...ntractCode.js |     100 |      100 |     100 |     100 |                   
  ...actStorage.js |     100 |      100 |     100 |     100 |                   
  revert.js        |     100 |      100 |     100 |     100 |                   
  saveStateRoot.js |     100 |      100 |     100 |     100 |                   
  setStateRoot.js  |     100 |      100 |     100 |     100 |                   
  shallowCopy.js   |     100 |      100 |     100 |     100 |                   
 src/utils         |     100 |      100 |     100 |     100 |                   
  stripZeros.js    |     100 |      100 |     100 |     100 |                   
-------------------|---------|----------|---------|---------|-------------------

## @tevm/txpool

```bash
pnpm --filter @tevm/txpool run test:coverage
```

% Coverage report from v8
-----------|---------|----------|---------|---------|---------------------------
File       | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s         
-----------|---------|----------|---------|---------|---------------------------
All files  |   90.32 |    84.81 |   96.55 |   90.32 |                           
 TxPool.ts |    90.3 |    84.81 |   96.55 |    90.3 | ...59,493-494,618-619,721 
 index.ts  |     100 |      100 |     100 |     100 |                           
-----------|---------|----------|---------|---------|---------------------------

## @tevm/errors

```bash
pnpm --filter @tevm/errors run test:coverage
```

% Coverage report from v8
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------|---------|----------|---------|---------|-------------------
All files          |   99.94 |    87.58 |     100 |   99.94 |                   
 src               |     100 |      100 |     100 |     100 |                   
  ...rToMessage.js |     100 |      100 |     100 |     100 |                   
 src/client        |     100 |       50 |     100 |     100 |                   
  ...uredClient.js |     100 |       50 |     100 |     100 | 61                
 src/common        |     100 |       50 |     100 |     100 |                   
  ...matchError.js |     100 |       50 |     100 |     100 | 57                
  ...abledError.js |     100 |       50 |     100 |     100 | 60                
  index.js         |     100 |      100 |     100 |     100 |                   
 src/data          |     100 |      100 |     100 |     100 |                   
  ...eSizeError.js |     100 |      100 |     100 |     100 |                   
 src/defensive     |     100 |      100 |     100 |     100 |                   
  ...CheckError.js |     100 |      100 |     100 |     100 |                   
  ...eCodeError.js |     100 |      100 |     100 |     100 |                   
  index.js         |     100 |      100 |     100 |     100 |                   
 src/ethereum      |   99.82 |    97.34 |     100 |   99.82 |                   
  ...ockedError.js |     100 |      100 |     100 |     100 |                   
  ...FoundError.js |     100 |      100 |     100 |     100 |                   
  BaseError.js     |   97.24 |    98.14 |     100 |   97.24 | 68-71             
  [... many more error files ...]
-------------------|---------|----------|---------|---------|-------------------

## @tevm/jsonrpc

```bash
pnpm --filter @tevm/jsonrpc run test:coverage
```

% Coverage report from v8
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------|---------|----------|---------|---------|-------------------
All files          |     100 |      100 |     100 |     100 |                   
 ...nRpcFetcher.js |     100 |      100 |     100 |     100 |                   
 index.js          |     100 |      100 |     100 |     100 |                   
-------------------|---------|----------|---------|---------|-------------------

## @tevm/logger

```bash
pnpm --filter @tevm/logger run test:coverage
```

% Coverage report from v8
-----------------|---------|----------|---------|---------|-------------------
File             | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-----------------|---------|----------|---------|---------|-------------------
All files        |     100 |      100 |     100 |     100 |                   
 createLogger.js |     100 |      100 |     100 |     100 |                   
-----------------|---------|----------|---------|---------|-------------------

## @tevm/node

```bash
pnpm --filter @tevm/node run test:coverage
```

% Coverage report from v8
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------|---------|----------|---------|---------|-------------------
All files          |     100 |    99.26 |   91.17 |     100 |                   
 ...LT_CHAIN_ID.js |     100 |      100 |     100 |     100 |                   
 GENESIS_STATE.js  |     100 |      100 |     100 |     100 |                   
 addPredeploy.js   |     100 |      100 |     100 |     100 |                   
 createTevmNode.js |     100 |    99.07 |      90 |     100 | 76                
 getBlockNumber.js |     100 |      100 |     100 |     100 |                   
 getChainId.js     |     100 |      100 |     100 |     100 |                   
 statePersister.js |     100 |      100 |     100 |     100 |                   
-------------------|---------|----------|---------|---------|-------------------

## @tevm/memory-client

```bash
pnpm --filter @tevm/memory-client run test:coverage
```

% Coverage report from v8
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------|---------|----------|---------|---------|-------------------
All files          |     100 |      100 |     100 |     100 |                   
 createClient.js   |     100 |      100 |     100 |     100 |                   
 ...emoryClient.js |     100 |      100 |     100 |     100 |                   
 ...vmTransport.js |     100 |      100 |     100 |     100 |                   
 index.js          |     100 |      100 |     100 |     100 |                   
 tevmCall.js       |     100 |      100 |     100 |     100 |                   
 tevmContract.js   |     100 |      100 |     100 |     100 |                   
 tevmDeploy.js     |     100 |      100 |     100 |     100 |                   
 tevmDumpState.js  |     100 |      100 |     100 |     100 |                   
 tevmGetAccount.js |     100 |      100 |     100 |     100 |                   
 tevmLoadState.js  |     100 |      100 |     100 |     100 |                   
 tevmMine.js       |     100 |      100 |     100 |     100 |                   
 tevmReady.js      |     100 |      100 |     100 |     100 |                   
 tevmSetAccount.js |     100 |      100 |     100 |     100 |                   
 ...ViemActions.js |     100 |      100 |     100 |     100 |                   
-------------------|---------|----------|---------|---------|-------------------

## @tevm/precompiles

```bash
pnpm --filter @tevm/precompiles run test:coverage
```

% Coverage report from v8
----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
----------|---------|----------|---------|---------|-------------------
All files |       0 |        0 |       0 |       0 |                   
----------|---------|----------|---------|---------|-------------------

## @tevm/predeploys

```bash
pnpm --filter @tevm/predeploys run test:coverage
```

% Coverage report from v8
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------|---------|----------|---------|---------|-------------------
All files          |     100 |      100 |     100 |     100 |                   
 ...nePredeploy.js |     100 |      100 |     100 |     100 |                   
-------------------|---------|----------|---------|---------|-------------------

## @tevm/rlp

```bash
pnpm --filter @tevm/rlp run test:coverage
```

% Coverage report from v8
----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
----------|---------|----------|---------|---------|-------------------
All files |       0 |        0 |       0 |       0 |                   
----------|---------|----------|---------|---------|-------------------

## @tevm/trie

```bash
pnpm --filter @tevm/trie run test:coverage
```

% Coverage report from v8
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------|---------|----------|---------|---------|-------------------
All files          |     100 |      100 |     100 |     100 |                   
 ..._STATE_ROOT.js |     100 |      100 |     100 |     100 |                   
-------------------|---------|----------|---------|---------|-------------------

## @tevm/tx

```bash
pnpm --filter @tevm/tx run test:coverage
```

% Coverage report from v8
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------|---------|----------|---------|---------|-------------------
All files          |     100 |      100 |     100 |     100 |                   
 ...ersonatedTx.js |     100 |      100 |     100 |     100 |                   
-------------------|---------|----------|---------|---------|-------------------

## @tevm/utils

```bash
pnpm --filter @tevm/utils run test:coverage
```

% Coverage report from v8
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------|---------|----------|---------|---------|-------------------
All files          |     100 |      100 |     100 |     100 |                   
 createMemoryDb.js |     100 |      100 |     100 |     100 |                   
 ethereumjs.js     |     100 |      100 |     100 |     100 |                   
 viem.js           |     100 |      100 |     100 |     100 |                   
-------------------|---------|----------|---------|---------|-------------------

## @tevm/receipt-manager

```bash
pnpm --filter @tevm/receipt-manager run test:coverage
```

% Coverage report from v8
-------------------|---------|----------|---------|---------|---------------------------------------------------------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s                                                   
-------------------|---------|----------|---------|---------|---------------------------------------------------------------------
All files          |   71.87 |    80.85 |   83.33 |   71.87 |                                                                   
 MapDb.ts          |       0 |        0 |       0 |       0 |                                                                   
 ReceiptManager.ts |   59.82 |     77.5 |      75 |   59.82 | 250-251,314-318,324-325,349-361,386-446,477,496-497,499,567,580-595
 createMapDb.js    |     100 |      100 |     100 |     100 |                                                                   
 index.ts          |     100 |      100 |     100 |     100 |                                                                   
-------------------|---------|----------|---------|---------|---------------------------------------------------------------------

## @tevm/server

```bash
pnpm --filter @tevm/server run test:coverage
```

% Coverage report from v8
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------|---------|----------|---------|---------|-------------------
All files          |     100 |      100 |     100 |     100 |                 
 src               |     100 |      100 |     100 |     100 |                 
  ...ttpHandler.js |     100 |      100 |     100 |     100 |                 
  createServer.js  |     100 |      100 |     100 |     100 |                 
  index.js         |     100 |      100 |     100 |     100 |                 
 src/adapters      |     100 |      100 |     100 |     100 |                 
  ...Middleware.js |     100 |      100 |     100 |     100 |                 
  ...ApiHandler.js |     100 |      100 |     100 |     100 |                 
  index.js         |     100 |      100 |     100 |     100 |                 
 src/errors        |     100 |      100 |     100 |     100 |                 
  ...dJsonError.js |     100 |      100 |     100 |     100 |                 
  ...tBodyError.js |     100 |      100 |     100 |     100 |                 
 src/internal      |     100 |      100 |     100 |     100 |                 
  ...equestBody.js |     100 |      100 |     100 |     100 |                 
  ...ulkRequest.js |     100 |      100 |     100 |     100 |                 
  handleError.js   |     100 |      100 |     100 |     100 |                 
  parseRequest.js  |     100 |      100 |     100 |     100 |                 
-------------------|---------|----------|---------|---------|-------------------

## @tevm/sync-storage-persister

```bash
pnpm --filter @tevm/sync-storage-persister run test:coverage
```

% Coverage report from v8
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------|---------|----------|---------|---------|-------------------
All files          |     100 |      100 |     100 |     100 |                 
 ...gePersister.js |     100 |      100 |     100 |     100 |                 
 index.js          |     100 |      100 |     100 |     100 |                 
 noopPersister.js  |     100 |      100 |     100 |     100 |                 
 throttle.js       |     100 |      100 |     100 |     100 |                 
-------------------|---------|----------|---------|---------|-------------------

## @tevm/effect

```bash
pnpm --filter @tevm/effect run test:coverage
```

% Coverage report from v8
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------|---------|----------|---------|---------|-------------------
All files          |     100 |      100 |     100 |     100 |                  
 ...quireEffect.js |     100 |      100 |     100 |     100 |                  
 fileExists.js     |     100 |      100 |     100 |     100 |                  
 index.js          |     100 |      100 |     100 |     100 |                  
 logAllErrors.js   |     100 |      100 |     100 |     100 |                  
 parseJson.js      |     100 |      100 |     100 |     100 |                  
 resolve.js        |     100 |      100 |     100 |     100 |                  
-------------------|---------|----------|---------|---------|-------------------

## @tevm/http-client

```bash
pnpm --filter @tevm/http-client run test:coverage
```

% Coverage report from v8
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------|---------|----------|---------|---------|-------------------
All files          |    2.82 |       50 |   42.85 |    2.82 |                  
 src               |      40 |       50 |      40 |      40 |                  
  HttpClient.ts    |       0 |        0 |       0 |       0 |                  
  ...entOptions.ts |       0 |        0 |       0 |       0 |                  
  ...HttpClient.js |   43.47 |      100 |       0 |   43.47 | 12-24            
  index.js         |       0 |        0 |       0 |       0 | 1                
  index.ts         |       0 |        0 |       0 |       0 | 1                
 src/test          |       0 |       50 |      50 |       0 |                  
  Add.s.sol.ts     |       0 |        0 |       0 |       0 | 1-39             
  ERC20.sol.ts     |       0 |      100 |     100 |       0 | 2-298            
-------------------|---------|----------|---------|---------|-------------------

## @tevm/vm

```bash
pnpm --filter @tevm/vm run test:coverage
```

Coverage report from bun:
------------------------------------------------|---------|---------|-------------------
File                                            | % Funcs | % Lines | Uncovered Line #s
------------------------------------------------|---------|---------|-------------------
All files                                       |   75.58 |   74.57 |
 src/actions/BlockBuilder.ts                    |   75.00 |   84.80 | 66-72,128,171-189,282-292
 src/actions/BuildStatus.ts                     |  100.00 |  100.00 | 
 src/actions/DAOConfig.ts                       |  100.00 |  100.00 | 
 src/actions/accumulateParentBeaconBlockRoot.ts |  100.00 |   95.65 | 
 src/actions/accumulateParentBlockHash.ts       |    0.00 |    6.98 | 15-54
 src/actions/applyBlock.ts                      |  100.00 |   46.38 | 36,45,49-52,55,64-80,82-91,93-95
 src/actions/applyDAOHardfork.ts                |    0.00 |    6.25 | 9-38
 src/actions/applyTransactions.ts               |  100.00 |   24.07 | 26-27,29-30,35-36,38-42,44-48,51,53-62,64,66,69-72,74,76-82
 src/actions/assignBlockRewards.ts              |  100.00 |  100.00 | 
 src/actions/assignWithdrawals.ts               |   50.00 |   35.71 | 9-17
 src/actions/buildBlock.ts                      |  100.00 |  100.00 | 
 src/actions/calculateMinerReward.ts            |  100.00 |  100.00 | 
 src/actions/calculateOmmerReward.ts            |  100.00 |  100.00 | 
 src/actions/constants.js                       |  100.00 |  100.00 | 
 src/actions/deepCopy.js                        |  100.00 |  100.00 | 
 src/actions/errorMessage.js                    |  100.00 |  100.00 | 
 src/actions/errorMsg.ts                        |  100.00 |  100.00 | 
 src/actions/execHardfork.js                    |  100.00 |  100.00 | 
 src/actions/genTxTrie.ts                       |    0.00 |   21.43 | 13-23
 src/actions/generateTxResult.ts                |  100.00 |   85.71 | 58-63
 src/actions/parentBeaconBlockRootAddress.ts    |  100.00 |  100.00 | 
 src/actions/rewardAccount.ts                   |  100.00 |  100.00 | 
 src/actions/runBlock.ts                        |  100.00 |   37.35 | 39,46-49,65,67,69,74-83,85-86,88-108,110-118,120
 src/actions/runTx.ts                           |  100.00 |   68.42 | 54,62-65,88,107-112,123-130,141-146,155-156,180-183,187-189,192-204,212-217,242,244-247,254,263,295,303-305,314,324,349-350,352-356,364,367-374
 src/actions/txLogsBloom.js                     |  100.00 |  100.00 | 
 src/actions/validateRunTx.js                   |  100.00 |  100.00 | 
 src/actions/warmAddresses2929.js               |  100.00 |  100.00 | 
 src/createBaseVm.js                            |  100.00 |  100.00 | 
 src/createVm.js                                |   66.67 |  100.00 | 
------------------------------------------------|---------|---------|-------------------

## @tevm/ts-plugin

```bash
pnpm --filter @tevm/ts-plugin run test:coverage
```

% Coverage report from v8
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------|---------|----------|---------|---------|-------------------
All files          |   30.97 |    92.41 |   92.85 |   30.97 |                  
 src               |   12.56 |    71.42 |      60 |   12.56 |                  
  index.ts         |     100 |      100 |     100 |     100 |                  
  ...-coverage.cjs |       0 |        0 |       0 |       0 | 1-204            
  ...l-coverage.js |       0 |        0 |       0 |       0 | 1-204            
  tsPlugin.ts      |     100 |      100 |     100 |     100 |                  
 src/bin           |       0 |      100 |     100 |       0 |                  
  tevm-gen.ts      |       0 |      100 |     100 |       0 | 2-97             
 src/decorators    |   97.25 |     86.2 |     100 |   97.25 |                  
  ...AtPosition.ts |     100 |    76.66 |     100 |     100 | 86,91,102-110    
  getScriptKind.ts |     100 |      100 |     100 |     100 |                  
  ...ptSnapshot.ts |    87.5 |    91.66 |     100 |    87.5 | 36-40            
  index.ts         |     100 |      100 |     100 |     100 |                  
  ...meLiterals.ts |     100 |      100 |     100 |     100 |                  
 src/factories     |     100 |      100 |     100 |     100 |                  
  decorator.ts     |     100 |      100 |     100 |     100 |                  
  ...cessObject.ts |     100 |      100 |     100 |     100 |                  
  index.ts         |     100 |      100 |     100 |     100 |                  
  logger.ts        |     100 |      100 |     100 |     100 |                  
 src/test/fixtures |       0 |        0 |       0 |       0 |                  
  ...World3.sol.ts |       0 |        0 |       0 |       0 | 1-653            
 src/utils         |     100 |      100 |     100 |     100 |                  
  ...nitionInfo.ts |     100 |      100 |     100 |     100 |                  
  ...omTevmNode.ts |     100 |      100 |     100 |     100 |                  
  findNode.ts      |     100 |      100 |     100 |     100 |                  
  index.ts         |     100 |      100 |     100 |     100 |                  
  invariant.ts     |     100 |      100 |     100 |     100 |                  
  ...veSolidity.ts |     100 |      100 |     100 |     100 |                  
  isSolidity.ts    |     100 |      100 |     100 |     100 |                  
  ...sonAsConst.ts |     100 |      100 |     100 |     100 |                  
  ...leResolver.ts |     100 |      100 |     100 |     100 |                  
-------------------|---------|----------|---------|---------|-------------------

## @tevm/base-bundler

```bash
pnpm --filter @tevm/base-bundler run test:coverage
```

% Coverage report from v8
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------|---------|----------|---------|---------|-------------------
All files          |     100 |      100 |     100 |     100 |                  
 bundler.js        |     100 |      100 |     100 |     100 |                  
 ...ontractPath.js |     100 |      100 |     100 |     100 |                  
 index.js          |     100 |      100 |     100 |     100 |                  
 readCache.js      |     100 |      100 |     100 |     100 |                  
 readCacheSync.js  |     100 |      100 |     100 |     100 |                  
 ...ModuleAsync.js |     100 |      100 |     100 |     100 |                  
 ...eModuleSync.js |     100 |      100 |     100 |     100 |                  
 types.ts          |       0 |        0 |       0 |       0 |                  
 writeCache.js     |     100 |      100 |     100 |     100 |                  
 writeCacheSync.js |     100 |      100 |     100 |     100 |                  
-------------------|---------|----------|---------|---------|-------------------

## @tevm/bundler-cache

```bash
pnpm --filter @tevm/bundler-cache run test:coverage
```

% Coverage report from v8
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------|---------|----------|---------|---------|-------------------
All files          |     100 |      100 |     100 |     100 |                  
 createCache.js    |     100 |      100 |     100 |     100 |                  
 ...tifactsPath.js |     100 |      100 |     100 |     100 |                  
 ...etadataPath.js |     100 |      100 |     100 |     100 |                  
 index.js          |     100 |      100 |     100 |     100 |                  
 readArtifacts.js  |     100 |      100 |     100 |     100 |                  
 ...tifactsSync.js |     100 |      100 |     100 |     100 |                  
 types.ts          |       0 |        0 |       0 |       0 |                  
 version.js        |     100 |      100 |     100 |     100 |                  
 writeArtifacts.js |     100 |      100 |     100 |     100 |                  
 ...tifactsSync.js |     100 |      100 |     100 |     100 |                  
-------------------|---------|----------|---------|---------|-------------------

## @tevm/compiler

```bash
pnpm --filter @tevm/compiler run test:coverage
```

% Coverage report from v8
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------|---------|----------|---------|---------|-------------------
All files          |   97.42 |    85.71 |     100 |   97.42 |                  
 compiler          |     100 |      100 |     100 |     100 |                  
  source.ts        |     100 |      100 |     100 |     100 |                  
 compiler/src      |     100 |      100 |     100 |     100 |                  
  index.js         |     100 |      100 |     100 |     100 |                  
  ...eArtifacts.js |     100 |      100 |     100 |     100 |                  
  ...ifactsSync.js |     100 |      100 |     100 |     100 |                  
  testing-utils.ts |     100 |      100 |     100 |     100 |                  
  types.ts         |       0 |        0 |       0 |       0 |                  
 ...r/src/compiler |      95 |    72.09 |     100 |      95 |                  
  ...eContracts.js |   94.69 |    72.72 |     100 |   94.69 | 111-114,116-118  
  ...tractsSync.js |   95.23 |    71.42 |     100 |   95.23 | 105-108,110-111  
  index.js         |     100 |      100 |     100 |     100 |                  
 ...iler/src/utils |     100 |      100 |     100 |     100 |                  
  formatPath.js    |     100 |      100 |     100 |     100 |                  
  index.js         |     100 |      100 |     100 |     100 |                  
  invariant.js     |     100 |      100 |     100 |     100 |                  
  isImportLocal.js |     100 |      100 |     100 |     100 |                  
  ...veSolidity.js |     100 |      100 |     100 |     100 |                  
  isSolidity.js    |     100 |      100 |     100 |     100 |                  
  ...lvePromise.js |     100 |      100 |     100 |     100 |                  
-------------------|---------|----------|---------|---------|-------------------

## @tevm/config

```bash
pnpm --filter @tevm/config run test:coverage
```

% Coverage report from v8
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------|---------|----------|---------|---------|-------------------
All files          |   91.35 |    97.66 |   91.37 |   91.35 |                  
 scripts           |       0 |        0 |       0 |       0 |                  
  dev.ts           |       0 |        0 |       0 |       0 | 1-6              
  fixture.ts       |       0 |        0 |       0 |       0 | 1-2              
  runFixture.ts    |       0 |        0 |       0 |       0 | 1-81             
 src               |     100 |      100 |     100 |     100 |                  
  defineConfig.js  |     100 |      100 |     100 |     100 |                  
  index.js         |     100 |      100 |     100 |     100 |                  
  loadConfig.js    |     100 |      100 |     100 |     100 |                  
  types.ts         |       0 |        0 |       0 |       0 |                  
 src/config        |     100 |      100 |     100 |     100 |                  
  index.js         |     100 |      100 |     100 |     100 |                  
  mergeConfigs.js  |     100 |      100 |     100 |     100 |                  
  ...UserConfig.js |     100 |      100 |     100 |     100 |                  
  withDefaults.js  |     100 |      100 |     100 |     100 |                  
 ...configFnThrows |       0 |        0 |       0 |       0 |                  
  evmts.config.ts  |       0 |        0 |       0 |       0 | 1-5              
 src/foundry       |     100 |      100 |     100 |     100 |                  
  index.js         |     100 |      100 |     100 |     100 |                  
  ...ndryConfig.js |     100 |      100 |     100 |     100 |                  
 src/json          |     100 |      100 |     100 |     100 |                  
  ...JsonConfig.js |     100 |      100 |     100 |     100 |                  
  ...appingstxt.js |     100 |      100 |     100 |     100 |                  
 src/tsconfig      |     100 |      100 |   93.33 |     100 |                  
  ...omTsConfig.js |     100 |      100 |     100 |     100 |                  
  index.js         |     100 |      100 |     100 |     100 |                  
  loadTsConfig.js  |     100 |      100 |    92.3 |     100 |                  
-------------------|---------|----------|---------|---------|-------------------

## @tevm/viem

```bash
pnpm --filter @tevm/viem run test:coverage
```

% Coverage report from v8
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------|---------|----------|---------|---------|-------------------
All files          |   59.19 |       75 |   89.74 |   59.19 |                  
 viem              |       0 |        0 |       0 |       0 |                  
  ...ts_errors.cjs |       0 |        0 |       0 |       0 | 1-17             
  fix_ts_errors.js |       0 |        0 |       0 |       0 | 1-18             
 viem/src          |   91.38 |    76.03 |   94.44 |   91.38 |                  
  GenError.ts      |       0 |        0 |       0 |       0 |                  
  GenResult.ts     |       0 |        0 |       0 |       0 |                  
  ...sticResult.ts |       0 |        0 |       0 |       0 |                  
  TypedError.ts    |       0 |        0 |       0 |       0 |                  
  ...TevmClient.ts |       0 |        0 |       0 |       0 |                  
  ...tDecorator.ts |       0 |        0 |       0 |       0 |                  
  ...mExtension.ts |       0 |        0 |       0 |       0 |                  
  ...sticClient.ts |       0 |        0 |       0 |       0 |                  
  ...tDecorator.ts |       0 |        0 |       0 |       0 |                  
  ...cExtension.ts |       0 |        0 |       0 |       0 |                  
  index.js         |     100 |      100 |     100 |     100 |                  
  index.ts         |       0 |        0 |       0 |       0 | 1-13             
  testAccounts.js  |     100 |      100 |     100 |     100 |                  
  tevmTransport.js |     100 |      100 |     100 |     100 |                  
  ...mExtension.js |   88.11 |    66.66 |      95 |   88.11 | ...83-185,214-237
  ...Optimistic.js |     100 |      100 |     100 |     100 |                  
 viem/src/tests    |       0 |      100 |     100 |       0 |                  
  ERC20.sol.ts     |       0 |      100 |     100 |       0 | 2-298            
-------------------|---------|----------|---------|---------|-------------------

## @tevm/ethers

```bash
pnpm --filter @tevm/ethers run test:coverage
```

% Coverage report from v8
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------|---------|----------|---------|---------|-------------------
All files          |   96.18 |    73.33 |     100 |   96.18 |                  
 src               |   96.18 |    73.33 |     100 |   96.18 |                  
  TevmProvider.js  |   96.62 |    66.66 |     100 |   96.62 | 91-94            
  index.js         |     100 |      100 |     100 |     100 |                  
  tevmSigner.js    |   94.33 |    85.71 |     100 |   94.33 | 57-61            
-------------------|---------|----------|---------|---------|-------------------

## @tevm/unplugin

```bash
pnpm --filter @tevm/unplugin run test:coverage
```

% Coverage report from v8
-----------------|---------|----------|---------|---------|-------------------
File             | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-----------------|---------|----------|---------|---------|-------------------
All files        |     100 |      100 |     100 |     100 |                   
 fao.js          |     100 |      100 |     100 |     100 |                   
 index.js        |     100 |      100 |     100 |     100 |                   
 tevmUnplugin.js |     100 |      100 |     100 |     100 |                   
-----------------|---------|----------|---------|---------|-------------------

## @tevm/esbuild-plugin

```bash
pnpm --filter @tevm/esbuild-plugin run test:coverage
```

% Coverage report from v8
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------|---------|----------|---------|---------|-------------------
All files          |   77.24 |        0 |       0 |   77.24 |                   
 ...dPluginTevm.js |     100 |      100 |     100 |     100 |                   
 index.js          |       0 |        0 |       0 |       0 | 1-34              
-------------------|---------|----------|---------|---------|-------------------

## @tevm/runtime

```bash
pnpm --filter @tevm/runtime run test:coverage
```

% Coverage report from v8
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------|---------|----------|---------|---------|-------------------
All files          |     100 |      100 |     100 |     100 |                   
 runtime           |     100 |      100 |     100 |     100 |                   
  TestContract.js  |     100 |      100 |     100 |     100 |                   
  source.ts        |     100 |      100 |     100 |     100 |                   
 runtime/src       |     100 |      100 |     100 |     100 |                   
  ...ateRuntime.js |     100 |      100 |     100 |     100 |                   
  ...teTevmBody.js |     100 |      100 |     100 |     100 |                   
  ...evmBodyDts.js |     100 |      100 |     100 |     100 |                   
  index.js         |     100 |      100 |     100 |     100 |                   
  types.ts         |       0 |        0 |       0 |       0 |                   
-------------------|---------|----------|---------|---------|-------------------

## tevm-run

```bash
pnpm --filter tevm-run run test:coverage
```

Coverage report from bun:
-------------------------------------|---------|---------|-------------------
File                                 | % Funcs | % Lines | Uncovered Line #s
-------------------------------------|---------|---------|-------------------
All files                            |   45.21 |   54.90 |
 ../base-bundler/dist/index.js       |   12.50 |   12.60 | 14,16-18,20,25-47,53-64,69-104,110-132,138-146,152-184,196-206,209-219,222-232,235-245,248-258,261-271,274-284,287-297
 ../bun/dist/index.js                |   33.33 |   52.27 | 11-13,33-34,43-44,60-61,121-128,131-155
 ../bundler-cache/dist/index.js      |    5.26 |   13.22 | 1-16,21-27,35-54,60-76,82-109,114-137,150,159,167,175,188-191,200-203,211-215,223-227,236-239,248-251,259-263,271-275
 ../compiler/dist/index.js           |    0.00 |    3.46 | 10-12,15-66,71-180,185-220,223-320,325-360
 ../config/dist/index.js             |   65.12 |   81.85 | 71-72,96-97,125-130,144,158,199-203,224-230,234-266,298,315-316,366-372,459,472,529-545,605-611
 ../resolutions/dist/index.js        |    0.00 |   17.14 | 8,13,33-35,39-78,94,98-129,138-139,143-145,161,178,182-249,252-261,277-287,292-320
 ../runtime/dist/index.js            |    0.00 |    5.30 | 5-59,64-112,117-128,131-139
 ../solc/dist/index.js               |    0.00 |   87.31 | 117-120,124-136
 plugins.js                          |  100.00 |  100.00 | 
 src/argsSchema.js                   |  100.00 |  100.00 | 
 src/configPath.js                   |  100.00 |  100.00 | 
 src/parseArgs.js                    |  100.00 |  100.00 | 
 src/run.js                          |  100.00 |   56.25 | 16-22
 ../../packages/effect/dist/index.js |   16.67 |   39.18 | 20,32,36-49,52-59,62-72,84,123-125,129-137,140-150
-------------------------------------|---------|---------|-------------------

## @tevm/bun-plugin

```bash
pnpm --filter @tevm/bun-plugin run test:coverage
```

% Coverage report from v8
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------|---------|----------|---------|---------|-------------------
All files          |    93.1 |    95.23 |   83.33 |    93.1 |                   
 bunFile.js        |       0 |        0 |       0 |       0 | 1-26              
 ...ccessObject.js |     100 |      100 |     100 |     100 |                   
 bunPluginTevm.js  |     100 |      100 |     100 |     100 |                   
 index.js          |     100 |      100 |     100 |     100 |                   
-------------------|---------|----------|---------|---------|-------------------
