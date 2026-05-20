# Wave 2 typecheck repair (round 3)

**Scope:** packages/actions, packages/node

## Errors fixed
- packages/node/src/createTevmNode.js:278 - Narrowed fork anchor before reading optional blockHash.
- packages/node/src/createTevmNode.js:376 - Cast fork block RPC result to typed number/hash shape before property reads.
- packages/node/src/createTevmNode.js:380 - Used typed fork block number for blockTag conversion.
- packages/node/src/createTevmNode.js:381 - Used typed fork block hash for fork anchor return.
- packages/node/src/createTevmNode.js:432 - Narrowed fork anchor before selecting blockHash or blockTag.
- packages/actions/src/anvil/anvilDropTransactionProcedure.js:27 - Cast validated transaction hash to Hex before hexToBytes.
- packages/actions/src/eth/ethGetBlockByHashProcedure.js:10 - Cast returned async procedure to EthGetBlockByHashJsonRpcProcedure while preserving result null.
- packages/actions/src/eth/ethGetTransactionByBlockHashAndIndexProcedure.js:10 - Cast returned async procedure to EthGetTransactionByBlockHashAndIndexJsonRpcProcedure while preserving result null.
- packages/actions/src/eth/ethGetTransactionByBlockNumberAndIndexProcedure.js:10 - Cast returned async procedure to EthGetTransactionByBlockNumberAndIndexJsonRpcProcedure while preserving result null.
- packages/actions/src/eth/ethGetTransactionReceipt.js:26 - Cast returned async handler to EthGetTransactionReceiptHandler.
- packages/actions/src/eth/ethSendRawTransactionProcedure.js:56 - Guarded automining error entry before reading code/message.
- packages/actions/src/eth/getBalanceHandler.js:44 - Guarded block-dependent state-root lookup behind a block check.
