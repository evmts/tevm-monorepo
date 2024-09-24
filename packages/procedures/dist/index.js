import { ForkError, InternalEvmError, InvalidParamsError, InternalError, MethodNotFoundError, MethodNotSupportedError } from '@tevm/errors';
import { dumpStateHandler, setAccountHandler, callHandler, traceCallHandler, forkAndCacheBlock, blockNumberHandler, chainIdHandler, ethGetLogsHandler, ethGetTransactionReceiptHandler, ethNewFilterHandler, ethSendTransactionHandler, gasPriceHandler, getBalanceHandler, getCodeHandler, getStorageAtHandler, getAccountHandler, loadStateHandler, mineHandler, scriptHandler, ethAccountsHandler, ethSignHandler, ethSignTransactionHandler } from '@tevm/actions';
import { hexToBytes, numberToHex, getAddress, EthjsAccount, hexToBigInt, hexToNumber, bytesToHex, toBytes, stringToHex } from '@tevm/utils';
import { createAddress } from '@tevm/address';
import { BlockHeader, Block } from '@tevm/block';
import { TransactionFactory, BlobEIP4844Transaction } from '@tevm/tx';
import { runTx } from '@tevm/vm';
import { createJsonRpcFetcher } from '@tevm/jsonrpc';

// src/requestProcedure.js
var anvilDropTransactionJsonRpcProcedure = (client) => {
  return async (request) => {
    const anvilDropTransactionRequest = (
      /** @type {import('./AnvilJsonRpcRequest.js').AnvilDropTransactionJsonRpcRequest}*/
      request
    );
    const txHash = anvilDropTransactionRequest.params[0].transactionHash;
    const txPool = await client.getTxPool();
    if (txPool.getByHash([hexToBytes(txHash)]).length > 0) {
      txPool.removeByHash(txHash);
    } else {
      throw new Error(
        "Only tx in the txpool are allowed to be dropped. Dropping transactions that have already been mined is not yet supported"
      );
    }
    return {
      method: anvilDropTransactionRequest.method,
      jsonrpc: "2.0",
      result: null,
      ...anvilDropTransactionRequest.id ? { id: anvilDropTransactionRequest.id } : {}
    };
  };
};
var dumpStateProcedure = (client) => async (request) => {
  const { errors = [], ...result } = await dumpStateHandler(client)({
    throwOnFail: false
  });
  const parsedState = {};
  for (const [k, v] of Object.entries(result.state)) {
    const { nonce, balance, storageRoot, codeHash } = v;
    parsedState[k] = {
      ...v,
      nonce: numberToHex(nonce),
      balance: numberToHex(balance),
      storageRoot,
      codeHash
    };
  }
  if (errors.length > 0) {
    const error = (
      /** @type {import('@tevm/actions').TevmDumpStateError}*/
      errors[0]
    );
    return {
      jsonrpc: "2.0",
      error: {
        code: error.code,
        message: error.message,
        data: {
          errors: errors.map(({ message }) => message)
        }
      },
      method: "tevm_dumpState",
      ...request.id === void 0 ? {} : { id: request.id }
    };
  }
  return {
    jsonrpc: "2.0",
    result: {
      state: parsedState
    },
    method: "tevm_dumpState",
    ...request.id === void 0 ? {} : { id: request.id }
  };
};

// src/anvil/anvilDumpStateProcedure.js
var anvilDumpStateJsonRpcProcedure = (client) => {
  return async (request) => {
    return (
      /** @type any*/
      {
        ...await dumpStateProcedure(client)({
          ...request.id ? { id: request.id } : {},
          jsonrpc: "2.0",
          method: "tevm_dumpState"
        }),
        method: request.method
      }
    );
  };
};

// src/anvil/anvilGetAutomineProcedure.js
var anvilGetAutomineJsonRpcProcedure = (client) => {
  return async (request) => {
    return {
      jsonrpc: "2.0",
      method: request.method,
      result: client.miningConfig.type === "auto",
      ...request.id ? { id: request.id } : {}
    };
  };
};
var anvilImpersonateAccountJsonRpcProcedure = (client) => {
  return async (request) => {
    try {
      client.setImpersonatedAccount(getAddress(request.params[0]));
      return {
        jsonrpc: "2.0",
        method: request.method,
        ...request.id ? { id: request.id } : {},
        result: null
      };
    } catch (e) {
      return {
        jsonrpc: "2.0",
        method: request.method,
        ...request.id ? { id: request.id } : {},
        // TODO use @tevm/errors
        error: {
          code: (
            /** @type any*/
            -32602
          ),
          message: (
            /** @type {Error}*/
            e.message
          )
        }
      };
    }
  };
};
var anvilLoadStateJsonRpcProcedure = (client) => {
  return async (request) => {
    const loadStateRequest = (
      /** @type {import('./AnvilJsonRpcRequest.js').AnvilLoadStateJsonRpcRequest}*/
      request
    );
    const vm = await client.getVm();
    return Promise.all(
      Object.entries(loadStateRequest.params[0].state).map(([address, rlpEncodedAccount]) => {
        return vm.stateManager.putAccount(
          createAddress(address),
          EthjsAccount.fromRlpSerializedAccount(hexToBytes(rlpEncodedAccount))
        );
      })
    ).then(() => {
      const response = {
        jsonrpc: "2.0",
        method: loadStateRequest.method,
        result: null,
        ...loadStateRequest.id ? { id: loadStateRequest.id } : {}
      };
      return response;
    }).catch((e) => {
      const response = {
        jsonrpc: "2.0",
        method: loadStateRequest.method,
        ...loadStateRequest.id ? { id: loadStateRequest.id } : {},
        error: {
          // TODO use @tevm/errors
          code: (
            /** @type any*/
            -32602
          ),
          message: e.message
        }
      };
      return response;
    });
  };
};

// src/anvil/anvilResetProcedure.js
var anvilResetJsonRpcProcedure = (client) => {
  return async (request) => {
    const vm = await client.getVm();
    vm.blockchain.blocksByTag.set(
      "latest",
      vm.blockchain.blocksByTag.get("forked") ?? vm.blockchain.blocksByTag.get("latest")
    );
    Array.from(vm.blockchain.blocks.values()).forEach((block) => {
      if (!block) return;
      vm.blockchain.delBlock(block.hash());
    });
    const stateManager = vm.stateManager.shallowCopy();
    vm.stateManager = /** @type any*/
    stateManager;
    vm.evm.stateManager = /** @type any*/
    stateManager;
    return {
      result: null,
      method: request.method,
      jsonrpc: "2.0",
      ...request.id ? { id: request.id } : {}
    };
  };
};
var setAccountProcedure = (client) => async (request) => {
  const { errors = [], ...result } = await setAccountHandler(client)({
    throwOnFail: false,
    address: request.params[0].address,
    ...request.params[0].nonce ? { nonce: hexToBigInt(request.params[0].nonce) } : {},
    ...request.params[0].balance ? { balance: hexToBigInt(request.params[0].balance) } : {},
    ...request.params[0].deployedBytecode ? { deployedBytecode: request.params[0].deployedBytecode } : {},
    ...request.params[0].storageRoot ? { storageRoot: request.params[0].storageRoot } : {},
    ...request.params[0].state ? { state: request.params[0].state } : {},
    ...request.params[0].stateDiff ? { stateDiff: request.params[0].stateDiff } : {}
  });
  if (errors.length > 0) {
    const error = (
      /** @type {import('@tevm/actions').TevmSetAccountError}*/
      errors[0]
    );
    return {
      jsonrpc: "2.0",
      error: {
        code: error.code,
        message: error.message,
        data: {
          errors: errors.map(({ message }) => message)
        }
      },
      method: "tevm_setAccount",
      ...request.id === void 0 ? {} : { id: request.id }
    };
  }
  return {
    jsonrpc: "2.0",
    result,
    method: "tevm_setAccount",
    ...request.id === void 0 ? {} : { id: request.id }
  };
};

// src/anvil/anvilSetBalanceProcedure.js
var anvilSetBalanceJsonRpcProcedure = (client) => {
  return async (request) => {
    const balanceResult = await setAccountProcedure(client)({
      jsonrpc: request.jsonrpc,
      method: "tevm_setAccount",
      params: [
        {
          address: request.params[0],
          balance: request.params[1]
        }
      ],
      ...request.id ? { id: request.id } : {}
    });
    if (balanceResult.error) {
      return {
        jsonrpc: "2.0",
        method: request.method,
        error: (
          /** @type {any}*/
          balanceResult.error
        ),
        ...request.id !== void 0 ? { id: request.id } : {}
      };
    }
    return {
      jsonrpc: "2.0",
      method: request.method,
      result: null,
      ...request.id !== void 0 ? { id: request.id } : {}
    };
  };
};

// src/anvil/anvilSetCodeProcedure.js
var anvilSetCodeJsonRpcProcedure = (client) => {
  return async (request) => {
    const result = await setAccountProcedure(client)({
      jsonrpc: request.jsonrpc,
      method: "tevm_setAccount",
      params: [{ address: request.params[0], deployedBytecode: request.params[1] }],
      ...request.id ? { id: request.id } : {}
    });
    if (result.error) {
      return {
        ...request.id ? { id: request.id } : {},
        method: request.method,
        jsonrpc: request.jsonrpc,
        error: {
          code: (
            /** @type any*/
            -32602
          ),
          message: result.error.message
        }
      };
    }
    return {
      ...request.id ? { id: request.id } : {},
      method: request.method,
      jsonrpc: request.jsonrpc,
      result: null
    };
  };
};
var anvilSetCoinbaseJsonRpcProcedure = (client) => {
  return async (request) => {
    const vm = await client.getVm();
    const currentBlock = await vm.blockchain.getCanonicalHeadBlock();
    const coinbase = getAddress(request.params[0]);
    const newHeader = BlockHeader.fromHeaderData(
      {
        ...currentBlock.header.raw(),
        coinbase
      },
      {
        common: vm.common,
        freeze: false,
        setHardfork: false
      }
    );
    const newBlock = Block.fromBlockData(
      /** @type {any}*/
      {
        ...currentBlock,
        withdrawals: currentBlock.withdrawals,
        header: newHeader
      },
      {
        common: vm.common,
        freeze: false,
        setHardfork: false
      }
    );
    await vm.blockchain.putBlock(newBlock);
    return {
      method: request.method,
      result: coinbase,
      jsonrpc: "2.0",
      ...request.id ? { id: request.id } : {}
    };
  };
};

// src/anvil/anvilSetNonceProcedure.js
var anvilSetNonceJsonRpcProcedure = (client) => {
  return async (request) => {
    const balanceResult = await setAccountProcedure(client)({
      jsonrpc: request.jsonrpc,
      method: "tevm_setAccount",
      params: [
        {
          address: request.params[0],
          nonce: request.params[1]
        }
      ],
      ...request.id ? { id: request.id } : {}
    });
    if (balanceResult.error) {
      return {
        jsonrpc: "2.0",
        method: request.method,
        error: (
          /** @type {any}*/
          balanceResult.error
        ),
        ...request.id !== void 0 ? { id: request.id } : {}
      };
    }
    return {
      jsonrpc: "2.0",
      method: request.method,
      result: null,
      ...request.id !== void 0 ? { id: request.id } : {}
    };
  };
};

// src/anvil/anvilSetStorageAtProcedure.js
var anvilSetStorageAtJsonRpcProcedure = (client) => {
  return async (request) => {
    const result = await setAccountProcedure(client)({
      method: "tevm_setAccount",
      ...request.id ? { id: request.id } : {},
      jsonrpc: "2.0",
      params: [
        {
          address: request.params[0],
          stateDiff: {
            [request.params[1]]: request.params[2]
          }
        }
      ]
    });
    if (result.error) {
      return {
        error: (
          /** @type {any}*/
          result.error
        ),
        jsonrpc: "2.0",
        method: request.method,
        ...request.id ? { id: request.id } : {}
      };
    }
    return {
      jsonrpc: "2.0",
      method: request.method,
      ...request.id ? { id: request.id } : {},
      result: null
    };
  };
};

// src/anvil/anvilStopImpersonatingAccountProcedure.js
var anvilStopImpersonatingAccountJsonRpcProcedure = (client) => {
  return async (request) => {
    client.setImpersonatedAccount(void 0);
    return {
      jsonrpc: "2.0",
      method: request.method,
      result: null,
      ...request.id ? { id: request.id } : {}
    };
  };
};
var parseBlockTag = (blockTag) => {
  const blockHashLength = 64 + "0x".length;
  const isBlockNumber = typeof blockTag === "string" && blockTag.startsWith("0x") && blockTag.length !== blockHashLength;
  if (isBlockNumber) {
    return hexToBigInt(
      /** @type {import('@tevm/utils').Hex}*/
      blockTag
    );
  }
  return blockTag;
};

// src/call/callProcedure.js
var callProcedure = (client) => async (request) => {
  const { errors = [], ...result } = await callHandler(client)({
    throwOnFail: false,
    ...request.params[1] ? {
      stateOverrideSet: Object.fromEntries(
        Object.entries(request.params[1]).map(([address, state]) => [
          address,
          {
            ...state.code ? { code: state.code } : {},
            ...state.balance ? { balance: hexToBigInt(state.balance) } : {},
            ...state.nonce ? { nonce: hexToBigInt(state.nonce) } : {},
            ...state.state ? { state: state.state } : {},
            ...state.stateDiff ? { stateDiff: state.stateDiff } : {}
          }
        ])
      )
    } : {},
    ...request.params[2] ? {
      blockOverrideSet: {
        ...request.params[2].blobBaseFee ? { blobBaseFee: hexToBigInt(request.params[2].blobBaseFee) } : {},
        ...request.params[2].baseFee ? { baseFee: hexToBigInt(request.params[2].baseFee) } : {},
        ...request.params[2].gasLimit ? { gasLimit: hexToBigInt(request.params[2].gasLimit) } : {},
        ...request.params[2].coinbase ? { coinbase: request.params[2].coinbase } : {},
        ...request.params[2].time ? { time: hexToBigInt(request.params[2].time) } : {},
        ...request.params[2].number ? { number: hexToBigInt(request.params[2].number) } : {}
      }
    } : {},
    ...request.params[0].code ? { code: request.params[0].code } : {},
    ...request.params[0].blobVersionedHashes ? { blobVersionedHashes: request.params[0].blobVersionedHashes } : {},
    ...request.params[0].caller ? { caller: request.params[0].caller } : {},
    ...request.params[0].data ? { data: request.params[0].data } : {},
    ...request.params[0].depth ? { depth: request.params[0].depth } : {},
    ...request.params[0].gasPrice ? { gasPrice: hexToBigInt(request.params[0].gasPrice) } : {},
    ...request.params[0].gas ? { gas: hexToBigInt(request.params[0].gas) } : {},
    ...request.params[0].gasRefund ? { gasRefund: hexToBigInt(request.params[0].gasRefund) } : {},
    ...request.params[0].origin ? { origin: request.params[0].origin } : {},
    ...request.params[0].salt ? { salt: request.params[0].salt } : {},
    ...request.params[0].selfdestruct ? { selfdestruct: new Set(request.params[0].selfdestruct) } : {},
    ...request.params[0].skipBalance ? { skipBalance: request.params[0].skipBalance } : {},
    ...request.params[0].to ? { to: request.params[0].to } : {},
    ...request.params[0].value ? { value: hexToBigInt(request.params[0].value) } : {},
    ...request.params[0].blockTag ? { blockTag: parseBlockTag(request.params[0].blockTag) } : {},
    ...request.params[0].createTransaction ? { createTransaction: request.params[0].createTransaction } : {},
    ...request.params[0].from ? { from: request.params[0].from } : {},
    ...request.params[0].maxFeePerGas ? { maxFeePerGas: hexToBigInt(request.params[0].maxFeePerGas) } : {},
    ...request.params[0].maxPriorityFeePerGas ? { maxPriorityFeePerGas: hexToBigInt(request.params[0].maxPriorityFeePerGas) } : {}
    // TODO add support for manually setting nonce
    // ...(request.params[0].nonce ? { nonce: hexToBigInt(request.params[0].nonce) } : {}),
  });
  if (errors.length > 0) {
    const error = (
      /** @type {import('@tevm/actions').TevmCallError}*/
      errors[0]
    );
    return {
      jsonrpc: "2.0",
      error: {
        code: error.code,
        message: error.message,
        data: {
          errors: errors.map(({ message }) => message)
        }
      },
      method: "tevm_call",
      ...request.id === void 0 ? {} : { id: request.id }
    };
  }
  const accessList = result.accessList !== void 0 ? Object.fromEntries(Object.entries(result.accessList).map(([key, value]) => [key, [...value]])) : void 0;
  const toHex = (value) => (
    /**@type {import('@tevm/utils').Hex}*/
    numberToHex(value)
  );
  const out = {
    jsonrpc: "2.0",
    result: {
      executionGasUsed: toHex(result.executionGasUsed),
      rawData: result.rawData,
      ...result.selfdestruct ? { selfdestruct: [...result.selfdestruct] } : {},
      ...result.gasRefund ? { gasRefund: toHex(result.gasRefund) } : {},
      ...result.gas ? { gas: toHex(result.gas) } : {},
      ...result.logs ? { logs: result.logs } : {},
      ...result.txHash ? { txHash: result.txHash } : {},
      ...result.blobGasUsed ? { blobGasUsed: toHex(result.blobGasUsed) } : {},
      ...accessList !== void 0 ? { accessList } : {},
      ...result.preimages ? { preimages: result.preimages } : {},
      ...result.l1Fee ? { l1Fee: numberToHex(result.l1Fee) } : {},
      ...result.l1BaseFee ? { l1BaseFee: numberToHex(result.l1BaseFee) } : {},
      ...result.l1BlobFee ? { l1BlobFee: numberToHex(result.l1BlobFee) } : {},
      ...result.l1GasUsed ? { l1GasUsed: numberToHex(result.l1GasUsed) } : {},
      ...result.amountSpent ? { amountSpent: numberToHex(result.amountSpent) } : {},
      ...result.baseFee ? { baseFee: numberToHex(result.baseFee) } : {},
      ...result.totalGasSpent ? { totalGasSpent: numberToHex(result.totalGasSpent) } : {},
      ...result.trace ? {
        trace: {
          ...result.trace,
          gas: toHex(result.trace.gas),
          structLogs: result.trace.structLogs.map((log) => ({
            ...log,
            gas: toHex(log.gas),
            gasCost: toHex(log.gasCost),
            stack: [...log.stack]
          }))
        }
      } : {},
      ...result.createdAddress ? { createdAddress: result.createdAddress } : {},
      ...result.createdAddresses ? { createdAddresses: [...result.createdAddresses] } : {}
    },
    method: "tevm_call",
    ...request.id === void 0 ? {} : { id: request.id }
  };
  return out;
};
var debugTraceCallJsonRpcProcedure = (client) => {
  return async (request) => {
    const debugTraceCallRequest = (
      /** @type {import('./index.js').DebugTraceCallJsonRpcRequest}*/
      request
    );
    const { blockTag, tracer, to, gas, data, from, value, timeout, gasPrice, tracerConfig } = debugTraceCallRequest.params[0];
    const traceResult = await traceCallHandler(client)({
      tracer,
      ...to !== void 0 ? { to } : {},
      ...from !== void 0 ? { from } : {},
      ...gas !== void 0 ? { gas: hexToBigInt(gas) } : {},
      ...gasPrice !== void 0 ? { gasPrice: hexToBigInt(gasPrice) } : {},
      ...value !== void 0 ? { value: hexToBigInt(value) } : {},
      ...data !== void 0 ? { data } : {},
      ...blockTag !== void 0 ? { blockTag } : {},
      ...timeout !== void 0 ? { timeout } : {},
      ...tracerConfig !== void 0 ? { tracerConfig } : {}
    });
    return {
      method: debugTraceCallRequest.method,
      result: {
        gas: numberToHex(traceResult.gas),
        failed: traceResult.failed,
        returnValue: traceResult.returnValue,
        structLogs: traceResult.structLogs.map((log) => {
          return {
            gas: numberToHex(log.gas),
            gasCost: numberToHex(log.gasCost),
            op: log.op,
            pc: log.pc,
            stack: log.stack,
            depth: log.depth
          };
        })
      },
      jsonrpc: "2.0",
      ...debugTraceCallRequest.id ? { id: debugTraceCallRequest.id } : {}
    };
  };
};
var debugTraceTransactionJsonRpcProcedure = (client) => {
  return async (request) => {
    const { tracer, timeout, tracerConfig, transactionHash } = request.params[0];
    if (timeout !== void 0) {
      client.logger.warn("Warning: timeout is currently respected param of debug_traceTransaction");
    }
    const transactionByHashResponse = await requestProcedure(client)({
      method: "eth_getTransactionByHash",
      params: [transactionHash],
      jsonrpc: "2.0",
      id: 1
    });
    if ("error" in transactionByHashResponse) {
      return {
        error: (
          /** @type {any}*/
          transactionByHashResponse.error
        ),
        ...request.id !== void 0 ? { id: request.id } : {},
        jsonrpc: "2.0",
        method: request.method
      };
    }
    const vm = await client.getVm();
    const block = await vm.blockchain.getBlock(hexToBytes(transactionByHashResponse.result.blockHash));
    const parentBlock = await vm.blockchain.getBlock(block.header.parentHash);
    transactionByHashResponse.result.transactionIndex;
    const previousTx = block.transactions.filter(
      (_, i) => i < hexToNumber(transactionByHashResponse.result.transactionIndex)
    );
    const hasStateRoot = vm.stateManager.hasStateRoot(parentBlock.header.stateRoot);
    if (!hasStateRoot && client.forkTransport) {
      await forkAndCacheBlock(client, parentBlock);
    } else {
      return {
        jsonrpc: "2.0",
        method: request.method,
        ...request.id !== void 0 ? { id: request.id } : {},
        error: {
          // TODO use a @tevm/errors
          code: (
            /** @type any*/
            -32602
          ),
          message: "Parent block not found"
        }
      };
    }
    const vmClone = await vm.deepCopy();
    for (const tx of previousTx) {
      runTx(vmClone)({
        block: parentBlock,
        skipNonce: true,
        skipBalance: true,
        skipHardForkValidation: true,
        skipBlockGasLimitValidation: true,
        tx: await TransactionFactory.fromRPC(tx, {
          freeze: false,
          common: vmClone.common.ethjsCommon,
          allowUnlimitedInitCodeSize: true
        })
      });
    }
    const traceResult = await traceCallHandler(client)({
      tracer,
      ...transactionByHashResponse.result.to !== void 0 ? { to: transactionByHashResponse.result.to } : {},
      ...transactionByHashResponse.result.from !== void 0 ? { from: transactionByHashResponse.result.from } : {},
      ...transactionByHashResponse.result.gas !== void 0 ? { gas: hexToBigInt(transactionByHashResponse.result.gas) } : {},
      ...transactionByHashResponse.result.gasPrice !== void 0 ? { gasPrice: hexToBigInt(transactionByHashResponse.result.gasPrice) } : {},
      ...transactionByHashResponse.result.value !== void 0 ? { value: hexToBigInt(transactionByHashResponse.result.value) } : {},
      ...transactionByHashResponse.result.data !== void 0 ? { data: transactionByHashResponse.result.data } : {},
      ...transactionByHashResponse.result.blockHash !== void 0 ? { blockTag: transactionByHashResponse.result.blockHash } : {},
      ...timeout !== void 0 ? { timeout } : {},
      ...tracerConfig !== void 0 ? { tracerConfig } : {}
    });
    return {
      method: request.method,
      // TODO the typescript type for this return type is completely wrong because of copy pasta
      // This return value is correct shape
      result: (
        /** @type any*/
        {
          gas: numberToHex(traceResult.gas),
          failed: traceResult.failed,
          returnValue: traceResult.returnValue,
          structLogs: traceResult.structLogs.map((log) => {
            return {
              gas: numberToHex(log.gas),
              gasCost: numberToHex(log.gasCost),
              op: log.op,
              pc: log.pc,
              stack: log.stack,
              depth: log.depth
            };
          })
        }
      ),
      jsonrpc: "2.0",
      ...request.id ? { id: request.id } : {}
    };
  };
};
var blockNumberProcedure = (client) => async (req) => ({
  ...req.id ? { id: req.id } : {},
  jsonrpc: "2.0",
  method: req.method,
  result: await blockNumberHandler(client)({}).then(numberToHex)
});
var chainIdProcedure = (baseClient) => async (req) => ({
  ...req.id ? { id: req.id } : {},
  jsonrpc: "2.0",
  method: req.method,
  // TODO pass in a client instead
  result: await chainIdHandler(baseClient)({}).then(numberToHex)
});
var ethBlobBaseFeeJsonRpcProcedure = (client) => {
  return async (request) => {
    const vm = await client.getVm();
    const headBlock = await vm.blockchain.getCanonicalHeadBlock();
    return {
      result: numberToHex(headBlock.header.calcNextBlobGasPrice()),
      jsonrpc: "2.0",
      method: request.method,
      ...request.id ? { id: request.id } : {}
    };
  };
};

// src/eth/ethCallProcedure.js
var ethCallProcedure = (client) => async (req) => {
  const [tx, blockTag, stateOverrideSet, blockOverrideSet] = req.params;
  const { data, from, to, gas, gasPrice, value } = tx;
  const response = await callProcedure(client)({
    ...req.id !== void 0 ? { id: req.id } : {},
    jsonrpc: req.jsonrpc,
    method: "tevm_call",
    params: [
      {
        ...gasPrice !== void 0 ? { gasPrice } : {},
        ...data !== void 0 ? { data } : {},
        ...gas !== void 0 ? { gas } : {},
        ...value !== void 0 ? { value } : {},
        ...to !== void 0 ? { to } : {},
        ...from !== void 0 ? { from } : {},
        ...blockTag !== void 0 ? { blockTag } : {}
      },
      stateOverrideSet,
      blockOverrideSet
    ]
  });
  if (!response.result) {
    return {
      jsonrpc: req.jsonrpc,
      method: "eth_call",
      error: response.error,
      ...req.id !== void 0 ? { id: req.id } : {}
    };
  }
  return {
    jsonrpc: req.jsonrpc,
    method: "eth_call",
    result: response.result.rawData,
    ...req.id !== void 0 ? { id: req.id } : {}
  };
};

// src/eth/ethCoinbaseProcedure.js
var ethCoinbaseJsonRpcProcedure = (client) => {
  return async (request) => {
    return {
      ...request.id ? { id: request.id } : {},
      method: request.method,
      jsonrpc: request.jsonrpc,
      // same default as hardhat
      result: await client.getVm().then((vm) => vm.blockchain.getCanonicalHeadBlock()).then((block) => (
        /** @type {import('@tevm/utils').Address}*/
        block.header.coinbase.toString()
      ))
    };
  };
};

// src/eth/ethEstimateGasProcedure.js
var ethEstimateGasJsonRpcProcedure = (client) => {
  return async (request) => {
    const estimateGasRequest = (
      /** @type {import('./EthJsonRpcRequest.js').EthEstimateGasJsonRpcRequest}*/
      request
    );
    const [_params, blockTag, stateOverrides, blockOverrides] = estimateGasRequest.params;
    const getParams = () => {
      const params = [
        {
          ..._params,
          ...blockTag !== void 0 ? { blockTag } : {}
        }
      ];
      if (blockOverrides !== void 0) {
        params.push(stateOverrides ?? {}, blockOverrides);
      }
      if (stateOverrides !== void 0) {
        params.push(...params, stateOverrides);
      }
      return params;
    };
    const callResult = await callProcedure(client)({
      ...estimateGasRequest,
      params: getParams(),
      method: "tevm_call"
    });
    if (callResult.error || !callResult.result) {
      return {
        ...callResult,
        method: estimateGasRequest.method
      };
    }
    return {
      method: estimateGasRequest.method,
      result: callResult.result.totalGasSpent ?? callResult.result.executionGasUsed,
      jsonrpc: "2.0",
      ...estimateGasRequest.id ? { id: estimateGasRequest.id } : {}
    };
  };
};
var txToJsonRpcTx = (tx, block, txIndex) => {
  const txJSON = tx.toJSON();
  return (
    /** @type any*/
    {
      blockHash: bytesToHex(block.hash()),
      blockNumber: numberToHex(block.header.number),
      from: (
        /** @type {import('@tevm/utils').Address}*/
        tx.getSenderAddress().toString()
      ),
      gas: (
        /** @type {import('@tevm/utils').Hex} **/
        txJSON.gasLimit
      ),
      gasPrice: (
        /** @type {import('@tevm/utils').Hex}*/
        txJSON.gasPrice ?? txJSON.maxFeePerGas
      ),
      // TODO add this to the type
      ...{ maxFeePerGas: txJSON.maxFeePerGas },
      // TODO add this to the type
      ...{ maxPriorityFeePerGas: txJSON.maxPriorityFeePerGas },
      // TODO add this to the type
      ...{ type: numberToHex(tx.type) },
      ...txJSON.accessList !== void 0 ? { accessList: txJSON.accessList } : {},
      hash: bytesToHex(tx.hash()),
      data: (
        /** @type {import('@tevm/utils').Hex} */
        txJSON.data
      ),
      nonce: (
        /** @type {import('@tevm/utils').Hex}*/
        txJSON.nonce
      ),
      // these toString existed in ethereumjs but I don't think are necessary
      ...txJSON.to !== void 0 ? { to: (
        /** @type {import('@tevm/utils').Address} */
        txJSON.to.toString()
      ) } : {},
      ...txIndex !== void 0 ? { transactionIndex: numberToHex(txIndex) } : {},
      ...txJSON.value !== void 0 ? { value: txJSON.value } : {},
      ..."isImpersonated" in tx ? { isImpersonated: tx.isImpersonated } : {},
      ...txJSON.v !== void 0 ? { v: txJSON.v } : {},
      ...txJSON.r !== void 0 ? { r: txJSON.r } : {},
      ...txJSON.s !== void 0 ? { s: txJSON.s } : {},
      // TODO add this to the type
      ...{ maxFeePerBlobGas: txJSON.maxFeePerBlobGas },
      // TODO add this to the type
      ...{ blobVersionedHashes: txJSON.blobVersionedHashes }
    }
  );
};

// src/utils/blockToJsonRpcBlock.js
var blockToJsonRpcBlock = async (block, includeTransactions) => {
  const json = block.toJSON();
  const header = (
    /** @type {import('@tevm/block').JsonHeader}*/
    json.header
  );
  const transactions = block.transactions.map(
    (tx, txIndex) => includeTransactions ? txToJsonRpcTx(tx, block, txIndex) : bytesToHex(tx.hash())
  );
  const out = {
    number: (
      /** @type {import('@tevm/utils').Hex}*/
      header.number
    ),
    hash: bytesToHex(block.hash()),
    parentHash: (
      /** @type {import('@tevm/utils').Hex}*/
      header.parentHash
    ),
    // TODO add this to the type
    ...{ mixHash: header.mixHash },
    nonce: (
      /** @type {import('@tevm/utils').Hex}*/
      header.nonce
    ),
    sha3Uncles: (
      /** @type {import('@tevm/utils').Hex}*/
      header.uncleHash
    ),
    logsBloom: (
      /** @type {import('@tevm/utils').Hex}*/
      header.logsBloom
    ),
    transactionsRoot: (
      /** @type {import('@tevm/utils').Hex}*/
      header.transactionsTrie
    ),
    stateRoot: (
      /** @type {import('@tevm/utils').Hex}*/
      header.stateRoot
    ),
    miner: (
      /** @type {import('@tevm/utils').Address}*/
      header.coinbase
    ),
    difficulty: (
      /** @type {import('@tevm/utils').Hex}*/
      header.difficulty
    ),
    // TODO we need to actually add this
    totalDifficulty: (
      /** @type {import('@tevm/utils').Hex}*/
      "0x0"
    ),
    extraData: (
      /** @type {import('@tevm/utils').Hex}*/
      header.extraData
    ),
    size: numberToHex(toBytes(JSON.stringify(json)).byteLength),
    gasLimit: (
      /** @type {import('@tevm/utils').Hex}*/
      header.gasLimit
    ),
    gasUsed: (
      /** @type {import('@tevm/utils').Hex}*/
      header.gasUsed
    ),
    timestamp: (
      /** @type {import('@tevm/utils').Hex}*/
      header.timestamp
    ),
    uncles: block.uncleHeaders.map((uh) => bytesToHex(uh.hash())),
    // TODO fix this type
    transactions: (
      /** @type any*/
      transactions
    ),
    // TODO add this to the type
    ...{ baseFeePerGas: header.baseFeePerGas },
    ...{ receiptsRoot: header.receiptTrie },
    ...header.withdrawalsRoot !== void 0 ? {
      withdrawalsRoot: header.withdrawalsRoot,
      withdrawals: json.withdrawals
    } : {},
    ...header.blobGasUsed !== void 0 ? { blobGasUsed: header.blobGasUsed } : {},
    // TODO add this to the type
    ...{ requestsRoot: header.requestsRoot },
    // TODO add this to the type
    ...{ requests: block.requests?.map((req) => bytesToHex(req.serialize())) },
    // TODO add this to the type
    ...{ excessBlobGas: header.excessBlobGas },
    // TODO add this to the type
    ...{ parentBeaconBlockRoot: header.parentBeaconBlockRoot }
  };
  return out;
};

// src/eth/ethGetBlockByHashProcedure.js
var ethGetBlockByHashJsonRpcProcedure = (client) => {
  return async (request) => {
    const vm = await client.getVm();
    const block = await vm.blockchain.getBlock(hexToBytes(request.params[0]));
    const includeTransactions = request.params[1] ?? false;
    const result = await blockToJsonRpcBlock(block, includeTransactions);
    return {
      method: request.method,
      result,
      jsonrpc: "2.0",
      ...request.id ? { id: request.id } : {}
    };
  };
};
var ethGetBlockByNumberJsonRpcProcedure = (client) => {
  return async (request) => {
    const vm = await client.getVm();
    const blockTagOrNumber = request.params[0];
    const block = await (() => {
      if (blockTagOrNumber.startsWith("0x")) {
        return vm.blockchain.getBlock(hexToBigInt(
          /** @type {import('@tevm/utils').Hex}*/
          blockTagOrNumber
        ));
      }
      return vm.blockchain.blocksByTag.get(
        /** @type {import('@tevm/utils').BlockTag}*/
        blockTagOrNumber
      );
    })();
    if (!block && client.forkTransport) {
      const fetcher = createJsonRpcFetcher(client.forkTransport);
      const res = await fetcher.request({
        jsonrpc: "2.0",
        id: request.id ?? 1,
        method: request.method,
        params: [blockTagOrNumber, request.params[1] ?? false]
      });
      if (res.error) {
        return {
          ...request.id ? { id: request.id } : {},
          method: request.method,
          jsonrpc: request.jsonrpc,
          error: res.error
        };
      }
      return {
        ...request.id ? { id: request.id } : {},
        method: request.method,
        jsonrpc: request.jsonrpc,
        result: (
          /** @type {any}*/
          res.result
        )
      };
    }
    if (!block) {
      return {
        ...request.id ? { id: request.id } : {},
        method: request.method,
        jsonrpc: request.jsonrpc,
        error: {
          code: -32602,
          message: `Invalid block tag ${blockTagOrNumber}`
        }
      };
    }
    const includeTransactions = request.params[1] ?? false;
    const result = blockToJsonRpcBlock(block, includeTransactions);
    return {
      method: request.method,
      result,
      jsonrpc: "2.0",
      ...request.id ? { id: request.id } : {}
    };
  };
};
var ethGetBlockTransactionCountByHashJsonRpcProcedure = (client) => {
  return async (request) => {
    const vm = await client.getVm();
    const block = await vm.blockchain.getBlock(hexToBytes(request.params[0]));
    const result = block.transactions.length;
    return {
      method: request.method,
      result: numberToHex(result),
      jsonrpc: "2.0",
      ...request.id ? { id: request.id } : {}
    };
  };
};
var ethGetBlockTransactionCountByNumberJsonRpcProcedure = (client) => {
  return async (request) => {
    const vm = await client.getVm();
    const blockTagOrNumber = request.params[0];
    const block = await (() => {
      if (blockTagOrNumber.startsWith("0x")) {
        return vm.blockchain.getBlock(hexToBigInt(
          /** @type {import('@tevm/utils').Hex}*/
          blockTagOrNumber
        ));
      }
      return vm.blockchain.blocksByTag.get(
        /** @type {import('@tevm/utils').BlockTag}*/
        blockTagOrNumber
      );
    })();
    if (!block) {
      return {
        ...request.id ? { id: request.id } : {},
        method: request.method,
        jsonrpc: request.jsonrpc,
        error: {
          code: -32602,
          message: `Invalid block tag ${blockTagOrNumber}`
        }
      };
    }
    const result = block.transactions.length;
    return {
      method: request.method,
      result: numberToHex(result),
      jsonrpc: "2.0",
      ...request.id ? { id: request.id } : {}
    };
  };
};
var ethGetFilterChangesProcedure = (client) => {
  return async (request) => {
    const getFilterChangesRequest = (
      /** @type {import('./EthJsonRpcRequest.js').EthGetFilterChangesJsonRpcRequest}*/
      request
    );
    const [id] = getFilterChangesRequest.params;
    const filter = client.getFilters().get(id);
    if (!filter) {
      return {
        ...request.id ? { id: request.id } : {},
        method: request.method,
        jsonrpc: request.jsonrpc,
        error: {
          code: -32601,
          message: "Method not implemented yet"
        }
      };
    }
    switch (filter.type) {
      case "Log": {
        const { logs } = filter;
        const response = {
          ...request.id ? { id: request.id } : {},
          method: request.method,
          jsonrpc: request.jsonrpc,
          result: logs.map((log) => ({
            address: log.address,
            topics: log.topics,
            data: log.data,
            blockNumber: numberToHex(log.blockNumber),
            transactionHash: log.transactionHash,
            transactionIndex: numberToHex(log.transactionIndex),
            blockHash: log.blockHash,
            logIndex: numberToHex(log.logIndex),
            removed: log.removed
          }))
        };
        filter.logs = [];
        return response;
      }
      case "Block": {
        const { blocks } = filter;
        const response = {
          ...request.id ? { id: request.id } : {},
          // TODO fix this type
          result: (
            /** @type {any} */
            blocks.map((block) => numberToHex(block.header.number))
          ),
          method: request.method,
          jsonrpc: request.jsonrpc
        };
        filter.blocks = [];
        return response;
      }
      case "PendingTransaction": {
        const { tx } = filter;
        const response = {
          ...request.id ? { id: request.id } : {},
          // TODO fix this type
          result: (
            /** @type {any} */
            tx.map((tx2) => bytesToHex(tx2.hash()))
          ),
          method: request.method,
          jsonrpc: request.jsonrpc
        };
        filter.tx = [];
        return response;
      }
      default: {
        throw new Error(
          "InternalError: Unknown filter type. This indicates a bug in tevm or potentially a typo in filter type if manually added"
        );
      }
    }
  };
};
var ethGetFilterLogsProcedure = (client) => {
  return async (request) => {
    const filter = client.getFilters().get(request.params[0]);
    if (!filter) {
      return {
        ...request.id ? { id: request.id } : {},
        method: request.method,
        jsonrpc: request.jsonrpc,
        error: {
          code: -32602,
          message: "Filter not found"
        }
      };
    }
    try {
      const ethGetLogsResult = await ethGetLogsHandler(client)({
        filterParams: {
          fromBlock: filter.logsCriteria.fromBlock?.header?.number ?? 0n,
          toBlock: filter.logsCriteria.toBlock?.header?.number ?? "latest",
          address: filter.logsCriteria.address,
          topics: filter.logsCriteria.topics
        }
      });
      const jsonRpcResult = ethGetLogsResult.map((log) => ({
        address: log.address,
        topics: [...log.topics],
        data: log.data,
        blockNumber: numberToHex(log.blockNumber),
        transactionHash: log.transactionHash,
        transactionIndex: numberToHex(log.transactionIndex),
        blockHash: log.blockHash,
        logIndex: numberToHex(log.logIndex),
        removed: log.removed
      }));
      return {
        ...request.id ? { id: request.id } : {},
        method: request.method,
        jsonrpc: request.jsonrpc,
        result: jsonRpcResult
      };
    } catch (e) {
      return {
        ...request.id ? { id: request.id } : {},
        method: request.method,
        jsonrpc: request.jsonrpc,
        error: {
          code: -32601,
          message: (
            /** @type {Error}*/
            e.message
          )
        }
      };
    }
  };
};
var ethGetLogsProcedure = (client) => async (req) => {
  const result = await ethGetLogsHandler(client)({
    filterParams: req.params[0]
  });
  try {
    const jsonRpcResult = result.map((log) => ({
      address: log.address,
      topics: log.topics,
      data: log.data,
      blockNumber: numberToHex(log.blockNumber),
      transactionHash: log.transactionHash,
      transactionIndex: numberToHex(log.transactionIndex),
      blockHash: log.blockHash,
      logIndex: numberToHex(log.logIndex),
      removed: log.removed
    }));
    return {
      jsonrpc: req.jsonrpc,
      ...req.id !== void 0 ? { id: req.id } : {},
      method: req.method,
      result: jsonRpcResult
    };
  } catch (e) {
    return (
      /** @type {any}*/
      {
        jsonrpc: req.jsonrpc,
        ...req.id !== void 0 ? { id: req.id } : {},
        method: req.method,
        error: {
          code: -32e3,
          message: (
            /** @type {Error}*/
            e.message
          )
        }
      }
    );
  }
};
var ethGetTransactionByBlockHashAndIndexJsonRpcProcedure = (client) => {
  return async (request) => {
    const vm = await client.getVm();
    const block = await vm.blockchain.getBlock(hexToBytes(request.params[0]));
    const txIndex = hexToNumber(request.params[1]);
    const tx = block.transactions[txIndex];
    if (!tx) {
      return {
        ...request.id ? { id: request.id } : {},
        method: request.method,
        jsonrpc: request.jsonrpc,
        error: {
          code: -32602,
          message: "Transaction not found"
        }
      };
    }
    return {
      method: request.method,
      result: txToJsonRpcTx(tx, block, txIndex),
      jsonrpc: "2.0",
      ...request.id ? { id: request.id } : {}
    };
  };
};
var ethGetTransactionByBlockNumberAndIndexJsonRpcProcedure = (client) => {
  return async (request) => {
    const vm = await client.getVm();
    const blockTagOrNumber = request.params[0];
    const block = await (() => {
      if (blockTagOrNumber.startsWith("0x")) {
        return vm.blockchain.getBlock(hexToBigInt(
          /** @type {import('@tevm/utils').Hex}*/
          blockTagOrNumber
        ));
      }
      return vm.blockchain.blocksByTag.get(
        /** @type {import('@tevm/utils').BlockTag}*/
        blockTagOrNumber
      );
    })();
    if (!block) {
      return {
        ...request.id ? { id: request.id } : {},
        method: request.method,
        jsonrpc: request.jsonrpc,
        error: {
          code: -32602,
          message: `Invalid block tag ${blockTagOrNumber}`
        }
      };
    }
    const txIndex = hexToNumber(request.params[1]);
    const tx = block.transactions[txIndex];
    if (!tx) {
      return {
        ...request.id ? { id: request.id } : {},
        method: request.method,
        jsonrpc: request.jsonrpc,
        error: {
          code: -32602,
          message: "Transaction not found"
        }
      };
    }
    return {
      method: request.method,
      result: txToJsonRpcTx(tx, block, txIndex),
      jsonrpc: "2.0",
      ...request.id ? { id: request.id } : {}
    };
  };
};
var ethGetTransactionByHashJsonRpcProcedure = (client) => {
  return async (request) => {
    const vm = await client.getVm();
    const receiptsManager = await client.getReceiptsManager();
    const receipt = await receiptsManager.getReceiptByTxHash(hexToBytes(request.params[0]));
    if (!receipt && client.forkTransport) {
      const fetcher = createJsonRpcFetcher(client.forkTransport);
      const res = await fetcher.request({
        jsonrpc: "2.0",
        id: request.id ?? 1,
        method: request.method,
        params: [request.params[0]]
      });
      if (res.error) {
        return {
          ...request.id ? { id: request.id } : {},
          method: request.method,
          jsonrpc: request.jsonrpc,
          error: res.error
        };
      }
      return {
        ...request.id ? { id: request.id } : {},
        method: request.method,
        result: (
          /** @type any*/
          res.result
        ),
        jsonrpc: "2.0"
      };
    }
    if (!receipt) {
      return {
        ...request.id ? { id: request.id } : {},
        method: request.method,
        jsonrpc: request.jsonrpc,
        error: {
          code: -32602,
          message: "Transaction not found"
        }
      };
    }
    const [_receipt, blockHash, txIndex] = receipt;
    const block = await vm.blockchain.getBlock(blockHash);
    const tx = block.transactions[txIndex];
    if (!tx) {
      return {
        ...request.id ? { id: request.id } : {},
        method: request.method,
        jsonrpc: request.jsonrpc,
        error: {
          code: -32602,
          message: "Transaction not found"
        }
      };
    }
    return {
      method: request.method,
      result: txToJsonRpcTx(tx, block, txIndex),
      jsonrpc: "2.0",
      ...request.id ? { id: request.id } : {}
    };
  };
};
var ethGetTransactionCountProcedure = (node) => {
  return async (request) => {
    const [address, tag] = request.params;
    const block = await (async () => {
      const vm = await node.getVm();
      if (tag.startsWith("0x") && tag.length === 66) {
        return vm.blockchain.getBlock(hexToBytes(
          /** @type {import('@tevm/utils').Hex}*/
          tag
        ));
      }
      if (tag.startsWith("0x")) {
        return vm.blockchain.getBlock(hexToBigInt(
          /** @type {import('@tevm/utils').Hex}*/
          tag
        ));
      }
      if (tag === "pending") {
        return vm.blockchain.blocksByTag.get("latest");
      }
      if (tag === "latest" || tag === "safe" || tag === "earliest" || tag === "finalized") {
        return vm.blockchain.blocksByTag.get(tag);
      }
      return void 0;
    })();
    if (!block) {
      return {
        ...request.id ? { id: request.id } : {},
        method: request.method,
        jsonrpc: request.jsonrpc,
        error: {
          code: -32602,
          message: `Invalid block tag ${tag}`
        }
      };
    }
    const pendingCount = tag === "pending" ? await (async () => {
      const txPool = await node.getTxPool();
      const pendingTx = await txPool.getBySenderAddress(createAddress(address));
      return BigInt(pendingTx.length);
    })() : 0n;
    const includedCount = await (async () => {
      const vm = await node.getVm();
      if (!await vm.stateManager.hasStateRoot(block.header.stateRoot)) {
        return void 0;
      }
      const stateCopy = await vm.stateManager.deepCopy();
      await stateCopy.setStateRoot(block.header.stateRoot);
      const account = await stateCopy.getAccount(createAddress(address));
      return account?.nonce ?? 0n;
    })();
    if (includedCount === void 0 && node.forkTransport) {
      try {
        const result = await node.forkTransport.request(request);
        return {
          ...request.id ? { id: request.id } : {},
          method: request.method,
          jsonrpc: request.jsonrpc,
          result: numberToHex(hexToBigInt(result) + pendingCount)
        };
      } catch (e) {
        const err = new ForkError("Unable to resolve eth_getTransactionCount with fork", {
          cause: (
            /** @type {any}*/
            e
          )
        });
        return {
          ...request.id ? { id: request.id } : {},
          method: request.method,
          jsonrpc: request.jsonrpc,
          error: {
            code: err.code,
            message: err.message
          }
        };
      }
    }
    if (includedCount === void 0) {
      const err = new InternalEvmError(`No state root found for block tag ${tag} in eth_getTransactionCountProcedure`);
      node.logger.error(err);
      return {
        ...request.id ? { id: request.id } : {},
        method: request.method,
        jsonrpc: request.jsonrpc,
        error: {
          code: err.code,
          message: err.message
        }
      };
    }
    return {
      ...request.id ? { id: request.id } : {},
      method: request.method,
      jsonrpc: request.jsonrpc,
      result: numberToHex(pendingCount + includedCount)
    };
  };
};
var ethGetTransactionReceiptJsonRpcProcedure = (client) => async (req) => {
  const [txHash] = req.params;
  if (!txHash) {
    const out2 = {
      jsonrpc: "2.0",
      ...req.id ? { id: req.id } : {},
      method: req.method,
      error: {
        code: -32602,
        message: "Invalid params"
      }
    };
    return out2;
  }
  const res = await ethGetTransactionReceiptHandler(client)({ hash: txHash });
  const out = {
    jsonrpc: "2.0",
    ...req.id ? { id: req.id } : {},
    method: req.method,
    result: res && {
      blockHash: res.blockHash,
      blockNumber: numberToHex(res.blockNumber),
      cumulativeGasUsed: numberToHex(res.cumulativeGasUsed),
      from: res.from,
      to: res.to,
      gasUsed: numberToHex(res.gasUsed),
      transactionHash: res.transactionHash,
      transactionIndex: numberToHex(res.transactionIndex),
      contractAddress: res.contractAddress,
      logs: await Promise.all(
        res.logs.map((log) => ({
          address: log.address,
          blockHash: log.blockHash,
          blockNumber: numberToHex(log.blockNumber),
          data: log.data,
          logIndex: numberToHex(log.logIndex),
          removed: false,
          topics: [...log.topics],
          transactionIndex: numberToHex(log.transactionIndex),
          transactionHash: log.transactionHash
        }))
      ),
      logsBloom: res.logsBloom,
      status: res.status,
      ...res.blobGasUsed !== void 0 ? { blobGasUsed: numberToHex(res.blobGasUsed) } : {},
      ...res.blobGasPrice !== void 0 ? { blobGasPrice: numberToHex(res.blobGasPrice) } : {}
    }
  };
  return out;
};

// src/utils/generateRandomId.js
var generateRandomId = () => {
  return `0x${Array.from(crypto.getRandomValues(new Uint8Array(16))).map((b) => b.toString(16).padStart(2, "0")).join("")}`;
};

// src/eth/ethNewBlockFilterProcedure.js
var ethNewBlockFilterProcedure = (client) => {
  return async (request) => {
    const newBlockFilterRequest = (
      /** @type {import('./EthJsonRpcRequest.js').EthNewBlockFilterJsonRpcRequest}*/
      request
    );
    const id = generateRandomId();
    const listener = (block) => {
      const filter = client.getFilters().get(id);
      if (!filter) {
        return;
      }
      filter.blocks.push(block);
    };
    client.setFilter({
      id,
      type: "Block",
      created: Date.now(),
      logs: [],
      tx: [],
      blocks: [],
      installed: {},
      err: void 0,
      registeredListeners: [listener]
    });
    return {
      ...newBlockFilterRequest.id ? { id: newBlockFilterRequest.id } : {},
      method: newBlockFilterRequest.method,
      jsonrpc: newBlockFilterRequest.jsonrpc,
      result: id
    };
  };
};
var ethNewFilterJsonRpcProcedure = (tevmNode) => {
  return async (request) => {
    const newFilterRequest = (
      /** @type {import('./EthJsonRpcRequest.js').EthNewFilterJsonRpcRequest}*/
      request
    );
    try {
      return {
        jsonrpc: request.jsonrpc,
        method: request.method,
        result: await ethNewFilterHandler(tevmNode)(newFilterRequest.params[0]),
        ...request.id !== void 0 ? { id: request.id } : {}
      };
    } catch (e) {
      tevmNode.logger.error(e);
      const { code, message } = (
        /** @type {import('@tevm/actions').EthNewFilterError}*/
        e
      );
      return {
        error: {
          code,
          message
        },
        method: request.method,
        jsonrpc: request.jsonrpc,
        ...request.id !== void 0 ? { id: request.id } : {}
      };
    }
  };
};

// src/eth/ethNewPendingTransactionFilterProcedure.js
var ethNewPendingTransactionFilterProcedure = (client) => {
  return async (request) => {
    await client.ready();
    const id = generateRandomId();
    const listener = (tx) => {
      const filter = client.getFilters().get(id);
      if (!filter) {
        return;
      }
      filter.tx.push(tx);
    };
    client.on("newPendingTransaction", listener);
    client.setFilter({
      id,
      type: "PendingTransaction",
      created: Date.now(),
      logs: [],
      tx: [],
      blocks: [],
      installed: {},
      err: void 0,
      registeredListeners: [listener]
    });
    return {
      ...request.id ? { id: request.id } : {},
      method: request.method,
      jsonrpc: request.jsonrpc,
      result: id
    };
  };
};

// package.json
var version = "1.0.0-next.117";

// src/eth/ethProtocolVersionProcedure.js
var ethProtocolVersionJsonRpcProcedure = () => {
  return async (request) => {
    return {
      result: stringToHex(version),
      jsonrpc: "2.0",
      method: "eth_protocolVersion",
      ...request.id ? { id: request.id } : {}
    };
  };
};
var ethSendRawTransactionJsonRpcProcedure = (client) => {
  return async (request) => {
    const vm = await client.getVm();
    const [serializedTx] = request.params;
    const txBuf = hexToBytes(serializedTx);
    const tx = txBuf[0] === 3 ? BlobEIP4844Transaction.fromSerializedBlobTxNetworkWrapper(txBuf, { common: vm.common.ethjsCommon }) : TransactionFactory.fromSerializedData(txBuf, { common: vm.common.ethjsCommon });
    if (!tx.isSigned()) {
      const err = new InvalidParamsError("Transaction must be signed!");
      return {
        method: request.method,
        jsonrpc: "2.0",
        ...request.id ? { id: request.id } : {},
        error: {
          code: err._tag,
          message: err.message
        }
      };
    }
    const txPool = await client.getTxPool();
    await txPool.add(tx, true);
    return {
      method: request.method,
      result: bytesToHex(tx.hash()),
      jsonrpc: "2.0",
      ...request.id ? { id: request.id } : {}
    };
  };
};
var ethSendTransactionJsonRpcProcedure = (client) => {
  return async (request) => {
    const sendTransactionRequest = (
      /** @type {import('./index.js').EthSendTransactionJsonRpcRequest}*/
      request
    );
    const txHash = await ethSendTransactionHandler(client)({
      from: request.params[0].from,
      ...request.params[0].data ? { data: request.params[0].data } : {},
      ...request.params[0].to ? { to: request.params[0].to } : {},
      ...request.params[0].gas ? { gas: hexToBigInt(request.params[0].gas) } : {},
      ...request.params[0].gasPrice ? { gasPrice: hexToBigInt(request.params[0].gasPrice) } : {},
      ...request.params[0].value ? { value: hexToBigInt(request.params[0].value) } : {}
    });
    return {
      method: sendTransactionRequest.method,
      result: txHash,
      jsonrpc: "2.0",
      ...sendTransactionRequest.id ? { id: sendTransactionRequest.id } : {}
    };
  };
};

// src/eth/ethUninstallFilterProcedure.js
var ethUninstallFilterJsonRpcProcedure = (client) => {
  return async (request) => {
    const uninstallFilterRequest = (
      /** @type {import('./EthJsonRpcRequest.js').EthUninstallFilterJsonRpcRequest}*/
      request
    );
    const [filterId] = uninstallFilterRequest.params;
    const filter = client.getFilters().get(filterId);
    if (!filter) {
      return {
        ...uninstallFilterRequest.id ? { id: uninstallFilterRequest.id } : {},
        method: uninstallFilterRequest.method,
        jsonrpc: uninstallFilterRequest.jsonrpc,
        result: false
      };
    }
    const [listener] = filter.registeredListeners;
    if (filter.type === "Log" && listener) {
      client.removeListener("newLog", listener);
    } else if (filter.type === "Block" && listener) {
      client.removeListener("newBlock", listener);
    } else if (filter.type === "PendingTransaction" && listener) {
      client.removeListener("newPendingTransaction", listener);
    }
    client.removeFilter(filterId);
    return {
      ...request.id ? { id: request.id } : {},
      method: request.method,
      jsonrpc: request.jsonrpc,
      result: true
    };
  };
};
var gasPriceProcedure = ({ getVm, forkTransport }) => async (req) => ({
  ...req.id ? { id: req.id } : {},
  jsonrpc: "2.0",
  method: req.method,
  // TODO pass in a client instead
  result: await gasPriceHandler(
    /** @type any*/
    { getVm, forkTransport }
  )({}).then(numberToHex)
});
var getBalanceProcedure = (baseClient) => async (req) => {
  if (!req.params[1]) {
    throw new Error(
      'getBalanceProcedure received invalid parameters: Block parameter (req.params[1]) is missing or invalid. Expected a hex string or block tag (e.g., "latest", "earliest").'
    );
  }
  return {
    ...req.id ? { id: req.id } : {},
    jsonrpc: "2.0",
    method: req.method,
    result: numberToHex(
      await getBalanceHandler(baseClient)({
        address: req.params[0],
        ...req.params[1].startsWith("0x") ? { blockNumber: BigInt(req.params[1]) } : {
          blockTag: (
            /** @type {import('@tevm/utils').BlockTag}*/
            req.params[1]
          )
        }
      })
    )
  };
};
var getCodeProcedure = (baseClient) => async (req) => ({
  ...req.id ? { id: req.id } : {},
  jsonrpc: "2.0",
  method: req.method,
  result: await getCodeHandler(baseClient)({
    address: req.params[0],
    blockTag: req.params[1]
  })
});
var getStorageAtProcedure = (client) => async (req) => ({
  ...req.id ? { id: req.id } : {},
  jsonrpc: "2.0",
  method: req.method,
  result: await getStorageAtHandler(client)({
    address: req.params[0],
    position: req.params[1],
    blockTag: req.params[2]
  })
});
var getAccountProcedure = (client) => async (request) => {
  request.params;
  const { errors = [], ...result } = await getAccountHandler(client)({
    address: request.params[0].address,
    throwOnFail: false,
    returnStorage: request.params[0].returnStorage ?? false
  });
  if (errors.length > 0) {
    const error = (
      /** @type {import('@tevm/actions').TevmGetAccountError}*/
      errors[0]
    );
    return {
      jsonrpc: "2.0",
      error: {
        code: error.code,
        message: error.message,
        data: {
          errors: errors.map(({ message }) => message)
        }
      },
      method: "tevm_getAccount",
      ...request.id === void 0 ? {} : { id: request.id }
    };
  }
  return {
    jsonrpc: "2.0",
    result: (
      /** @type any*/
      {
        address: result.address,
        balance: numberToHex(result.balance ?? 0n),
        deployedBytecode: result.deployedBytecode ?? "0x0",
        nonce: numberToHex(result.nonce ?? 0n),
        storageRoot: result.storageRoot,
        isContract: result.isContract,
        isEmpty: result.isEmpty,
        codeHash: result.codeHash,
        storage: result.storage
      }
    ),
    method: "tevm_getAccount",
    ...request.id === void 0 ? {} : { id: request.id }
  };
};
var loadStateProcedure = (client) => async (request) => {
  const {
    params: [{ state }]
  } = request;
  const parsedState = {};
  for (const [k, v] of Object.entries(state)) {
    const { nonce, balance, storageRoot, codeHash } = v;
    parsedState[
      /** @type {import('@tevm/utils').Address}*/
      k
    ] = {
      ...v,
      nonce: hexToBigInt(nonce),
      balance: hexToBigInt(balance),
      storageRoot,
      codeHash
    };
  }
  const { errors = [] } = await loadStateHandler(client)({
    state: parsedState,
    throwOnFail: false
  });
  if (errors.length > 0) {
    const error = (
      /** @type {import('@tevm/actions').TevmLoadStateError}*/
      errors[0]
    );
    return {
      jsonrpc: "2.0",
      error: {
        code: error.code,
        message: error.message,
        data: {
          errors: errors.map(({ message }) => message)
        }
      },
      method: "tevm_loadState",
      ...request.id === void 0 ? {} : { id: request.id }
    };
  }
  return {
    jsonrpc: "2.0",
    result: {},
    method: "tevm_loadState",
    ...request.id === void 0 ? {} : { id: request.id }
  };
};
var mineProcedure = (client) => async (request) => {
  const { errors = [], ...result } = await mineHandler(client)({
    throwOnFail: false,
    interval: hexToNumber(request.params[1] ?? "0x0"),
    blockCount: hexToNumber(request.params[0] ?? "0x1")
  });
  if (errors.length > 0) {
    const error = (
      /** @type {import('@tevm/actions').TevmMineError}*/
      errors[0]
    );
    return {
      jsonrpc: "2.0",
      error: {
        code: error.code,
        message: error.message,
        data: {
          errors: errors.map(({ message }) => message)
        }
      },
      method: "tevm_mine",
      ...request.id === void 0 ? {} : { id: request.id }
    };
  }
  if (!result.blockHashes?.length) {
    const error = new InternalError("No blocks were mined");
    return {
      jsonrpc: "2.0",
      error: {
        code: error.code,
        message: error.message
      },
      method: "tevm_mine",
      ...request.id === void 0 ? {} : { id: request.id }
    };
  }
  return {
    jsonrpc: "2.0",
    result: {
      blockHashes: result.blockHashes ?? []
    },
    method: "tevm_mine",
    ...request.id === void 0 ? {} : { id: request.id }
  };
};
var scriptProcedure = (client) => async (request) => {
  let res;
  try {
    res = await scriptHandler(client)({
      throwOnFail: false,
      deployedBytecode: request.params[0].deployedBytecode,
      // internally we pass data directly in which works but typescript interface doesn't support publically
      abi: (
        /** @type any*/
        void 0
      ),
      functionName: (
        /** @type any*/
        void 0
      ),
      args: (
        /** @type any*/
        void 0
      ),
      ...{ data: request.params[0].data },
      ...request.params[0].deployedBytecode ? { deployedBytecode: request.params[0].deployedBytecode } : {},
      ...request.params[0].blobVersionedHashes ? { blobVersionedHashes: request.params[0].blobVersionedHashes } : {},
      ...request.params[0].caller ? { caller: request.params[0].caller } : {},
      ...request.params[0].data ? { data: request.params[0].data } : {},
      ...request.params[0].depth ? { depth: request.params[0].depth } : {},
      ...request.params[0].gasPrice ? { gasPrice: hexToBigInt(request.params[0].gasPrice) } : {},
      ...request.params[0].gasPrice ? { gasPrice: hexToBigInt(request.params[0].gasPrice) } : {},
      ...request.params[0].gas ? { gas: hexToBigInt(request.params[0].gas) } : {},
      ...request.params[0].gas ? { gas: hexToBigInt(request.params[0].gas) } : {},
      ...request.params[0].gasRefund ? { gasRefund: hexToBigInt(request.params[0].gasRefund) } : {},
      ...request.params[0].origin ? { origin: request.params[0].origin } : {},
      ...request.params[0].selfdestruct ? { selfdestruct: new Set(request.params[0].selfdestruct) } : {},
      ...request.params[0].skipBalance ? { skipBalance: request.params[0].skipBalance } : {},
      ...request.params[0].to ? { to: request.params[0].to } : {},
      ...request.params[0].value ? { value: hexToBigInt(request.params[0].value) } : {},
      ...request.params[0].blockTag ? { blockTag: parseBlockTag(request.params[0].blockTag) } : {},
      ...request.params[0].createTransaction !== void 0 ? { createTransaction: request.params[0].createTransaction } : {}
    });
  } catch (e) {
    const tevmError = (
      /** @type {import('@tevm/actions').TevmScriptError} */
      e
    );
    return {
      jsonrpc: "2.0",
      method: "tevm_script",
      error: {
        code: tevmError.code ?? -32e3,
        message: tevmError._tag ?? "An unexpected unhandled error occurred"
      },
      ...request.id === void 0 ? {} : { id: request.id }
    };
  }
  const { errors = [], ...result } = res;
  if (errors.length > 0) {
    const error = (
      /** @type {import('@tevm/actions').TevmScriptError}*/
      errors[0]
    );
    return {
      jsonrpc: "2.0",
      error: {
        code: error.code ?? -32e3,
        message: error.message ?? "An unexpected unhandled error occurred",
        data: {
          errors: errors.map(({ message }) => message)
        }
      },
      method: "tevm_script",
      ...request.id === void 0 ? {} : { id: request.id }
    };
  }
  const accessList = result.accessList !== void 0 ? Object.fromEntries(Object.entries(result.accessList).map(([key, value]) => [key, [...value]])) : void 0;
  const toHex = (value) => (
    /**@type {import('@tevm/utils').Hex}*/
    numberToHex(value)
  );
  return {
    jsonrpc: "2.0",
    result: {
      executionGasUsed: toHex(result.executionGasUsed),
      rawData: result.rawData,
      ...result.selfdestruct ? { selfdestruct: [...result.selfdestruct] } : {},
      ...result.gasRefund ? { gasRefund: toHex(result.gasRefund) } : {},
      ...result.gas ? { gas: toHex(result.gas) } : {},
      ...result.logs ? { logs: result.logs } : {},
      ...result.blobGasUsed ? { blobGasUsed: toHex(result.blobGasUsed) } : {},
      ...result.txHash ? { txHash: result.txHash } : {},
      ...result.blobGasUsed ? { blobGasUsed: toHex(result.blobGasUsed) } : {},
      ...accessList !== void 0 ? { accessList } : {},
      ...result.preimages ? { preimages: result.preimages } : {},
      ...result.l1Fee ? { l1DataFee: numberToHex(result.l1Fee) } : {},
      ...result.l1BaseFee ? { l1BaseFee: numberToHex(result.l1BaseFee) } : {},
      ...result.l1BlobFee ? { l1BlobFee: numberToHex(result.l1BlobFee) } : {},
      ...result.l1GasUsed ? { l1GasUsed: numberToHex(result.l1GasUsed) } : {},
      ...result.amountSpent ? { amountSpent: numberToHex(result.amountSpent) } : {},
      ...result.baseFee ? { baseFee: numberToHex(result.baseFee) } : {},
      ...result.totalGasSpent ? { totalGasSpent: numberToHex(result.totalGasSpent) } : {},
      ...result.trace ? {
        trace: {
          ...result.trace,
          gas: toHex(result.trace.gas),
          structLogs: result.trace.structLogs.map((log) => ({
            ...log,
            gas: toHex(log.gas),
            gasCost: toHex(log.gasCost),
            stack: [...log.stack]
          }))
        }
      } : {},
      ...result.createdAddress ? { createdAddress: result.createdAddress } : {},
      ...result.createdAddresses ? { createdAddresses: [...result.createdAddresses] } : {}
    },
    method: "tevm_script",
    ...request.id === void 0 ? {} : { id: request.id }
  };
};

// src/createHandlers.js
var createHandlers = (client) => {
  const tevmHandlers = {
    tevm_call: callProcedure(client),
    /**
     * @param {any} request
     */
    tevm_contract: (request) => {
      const err = new MethodNotSupportedError(
        "UnsupportedMethodError: tevm_contract is not supported. Encode the contract arguments and use tevm_call instead."
      );
      return (
        /**@type any*/
        {
          id: (
            /** @type any*/
            request.id
          ),
          method: request.method,
          jsonrpc: "2.0",
          error: {
            code: err._tag,
            message: err.message
          }
        }
      );
    },
    tevm_getAccount: getAccountProcedure(client),
    tevm_setAccount: setAccountProcedure(client),
    tevm_script: scriptProcedure(client),
    tevm_dumpState: dumpStateProcedure(client),
    tevm_loadState: loadStateProcedure(client),
    tevm_miner: mineProcedure(client)
  };
  const ethHandlers = {
    eth_blockNumber: blockNumberProcedure(client),
    eth_chainId: chainIdProcedure(client),
    eth_call: ethCallProcedure(client),
    eth_getCode: getCodeProcedure(client),
    eth_getStorageAt: getStorageAtProcedure(client),
    eth_gasPrice: gasPriceProcedure(client),
    eth_getBalance: getBalanceProcedure(client),
    eth_coinbase: ethCoinbaseJsonRpcProcedure(client),
    eth_mining: (
      /**
       * @param {any} request}
       */
      (request) => {
        return {
          result: client.status === "MINING",
          method: request.method,
          jsonrpc: "2.0",
          ...request.id ? { id: request.id } : {}
        };
      }
    ),
    eth_syncing: (
      /**
       * @param {any} request}
       */
      (request) => {
        return {
          result: client.status === "SYNCING",
          method: request.method,
          jsonrpc: "2.0",
          ...request.id ? { id: request.id } : {}
        };
      }
    ),
    eth_sendTransaction: ethSendTransactionJsonRpcProcedure(client),
    eth_sendRawTransaction: ethSendRawTransactionJsonRpcProcedure(client),
    eth_estimateGas: ethEstimateGasJsonRpcProcedure(client),
    eth_getTransactionReceipt: ethGetTransactionReceiptJsonRpcProcedure(client),
    eth_getLogs: ethGetLogsProcedure(client),
    eth_getBlockByHash: ethGetBlockByHashJsonRpcProcedure(client),
    eth_getBlockByNumber: ethGetBlockByNumberJsonRpcProcedure(client),
    eth_getBlockTransactionCountByHash: ethGetBlockTransactionCountByHashJsonRpcProcedure(client),
    eth_getBlockTransactionCountByNumber: ethGetBlockTransactionCountByNumberJsonRpcProcedure(client),
    eth_getTransactionByHash: ethGetTransactionByHashJsonRpcProcedure(client),
    eth_getTransactionByBlockHashAndIndex: ethGetTransactionByBlockHashAndIndexJsonRpcProcedure(client),
    eth_getTransactionByBlockNumberAndIndex: ethGetTransactionByBlockNumberAndIndexJsonRpcProcedure(client),
    eth_protocolVersion: ethProtocolVersionJsonRpcProcedure(),
    eth_getTransactionCount: ethGetTransactionCountProcedure(client),
    eth_newFilter: ethNewFilterJsonRpcProcedure(client),
    eth_getFilterLogs: ethGetFilterLogsProcedure(client),
    eth_newBlockFilter: ethNewBlockFilterProcedure(client),
    eth_uninstallFilter: ethUninstallFilterJsonRpcProcedure(client),
    eth_getFilterChanges: ethGetFilterChangesProcedure(client),
    eth_newPendingTransactionFilter: ethNewPendingTransactionFilterProcedure(client),
    eth_blobBaseFee: ethBlobBaseFeeJsonRpcProcedure(client)
  };
  const anvilHandlers = {
    anvil_setCode: anvilSetCodeJsonRpcProcedure(client),
    anvil_setBalance: anvilSetBalanceJsonRpcProcedure(client),
    anvil_setNonce: anvilSetNonceJsonRpcProcedure(client),
    anvil_setChainId: chainIdHandler(client),
    anvil_getAutomine: anvilGetAutomineJsonRpcProcedure(client),
    anvil_setCoinbase: anvilSetCoinbaseJsonRpcProcedure(client),
    anvil_mine: mineProcedure(client),
    anvil_reset: anvilResetJsonRpcProcedure(client),
    anvil_dropTransaction: anvilDropTransactionJsonRpcProcedure(client),
    anvil_dumpState: anvilDumpStateJsonRpcProcedure(client),
    anvil_loadState: anvilLoadStateJsonRpcProcedure(client),
    anvil_setStorageAt: anvilSetStorageAtJsonRpcProcedure(client),
    anvil_impersonateAccount: anvilImpersonateAccountJsonRpcProcedure(client),
    anvil_stopImpersonatingAccount: anvilStopImpersonatingAccountJsonRpcProcedure(client)
  };
  const tevmAnvilHandlers = Object.fromEntries(
    Object.entries(anvilHandlers).map(([key, value]) => {
      return [key.replace("anvil", "tevm"), value];
    })
  );
  const ganacheHandlers = Object.fromEntries(
    Object.entries(anvilHandlers).map(([key, value]) => {
      return [key.replace("anvil", "ganache"), value];
    })
  );
  const hardhatHandlers = Object.fromEntries(
    Object.entries(anvilHandlers).map(([key, value]) => {
      return [key.replace("anvil", "hardhat"), value];
    })
  );
  const debugHandlers = {
    debug_traceTransaction: debugTraceTransactionJsonRpcProcedure(client),
    debug_traceCall: debugTraceCallJsonRpcProcedure(client)
  };
  const allHandlers = {
    ...tevmHandlers,
    ...ethHandlers,
    ...anvilHandlers,
    ...tevmAnvilHandlers,
    ...ganacheHandlers,
    ...hardhatHandlers,
    ...debugHandlers
  };
  return allHandlers;
};

// src/requestProcedure.js
var requestProcedure = (client) => {
  const allHandlers = createHandlers(client);
  return async (request) => {
    await client.ready();
    client.logger.debug(request, "JSON-RPC request received");
    if (!(request.method in allHandlers)) {
      const err = new MethodNotFoundError(`UnsupportedMethodError: Unknown method ${/**@type any*/
      request.method}`);
      return (
        /** @type {any}*/
        {
          id: (
            /** @type any*/
            request.id ?? null
          ),
          method: (
            /** @type any*/
            request.method
          ),
          jsonrpc: "2.0",
          error: {
            code: err.code,
            message: err.message
          }
        }
      );
    }
    return allHandlers[
      /** @type {keyof typeof allHandlers}*/
      request.method
    ](request);
  };
};

// src/requestBulkProcedure.js
var requestBulkProcedure = (client) => async (requests) => {
  const handleRequest = requestProcedure(client);
  const responses = await Promise.allSettled(requests.map((request) => handleRequest(
    /** @type any*/
    request
  )));
  return responses.map((response, i) => {
    const request = (
      /** @type {import("@tevm/jsonrpc").JsonRpcRequest<string, object>} */
      requests[i]
    );
    if (response.status === "rejected") {
      client.logger.error(response.reason);
      return {
        id: request.id,
        method: request.method,
        jsonrpc: "2.0",
        error: {
          // TODO This should be added to @tevm/errors package and rexported in tevm
          code: "UnexpectedBulkRequestError",
          message: "UnexpectedBulkRequestError"
        }
      };
    }
    return response.value;
  });
};
var anvilSetChainIdJsonRpcProcedure = (client) => {
  return async (request) => {
    const chainId = hexToNumber(request.params[0]);
    if (!Number.isInteger(chainId) || chainId <= 0) {
      return {
        ...request.id ? { id: request.id } : {},
        method: request.method,
        jsonrpc: request.jsonrpc,
        error: {
          code: (
            /** @type any*/
            -32602
          ),
          message: `Invalid id ${chainId}. Must be a positive integer.`
        }
      };
    }
    const err = new MethodNotSupportedError(
      "UnsupportedMethodError: tevm_contract is not supported. Encode the contract arguments and use tevm_call instead."
    );
    client.logger.error(err);
    return (
      /**@type any*/
      {
        id: (
          /** @type any*/
          request.id
        ),
        jsonrpc: "2.0",
        error: {
          code: err._tag,
          message: err.message
        }
      }
    );
  };
};
var ethAccountsProcedure = (accounts) => async (req) => ({
  ...req.id ? { id: req.id } : {},
  jsonrpc: "2.0",
  method: req.method,
  result: await ethAccountsHandler({ accounts })({})
});
var ethSignProcedure = (accounts) => async (req) => ({
  ...req.id ? { id: req.id } : {},
  jsonrpc: "2.0",
  method: req.method,
  result: await ethSignHandler({ accounts })({
    address: req.params[0],
    data: req.params[1]
  })
});
var ethSignTransactionProcedure = (options) => async (req) => ({
  ...req.id ? { id: req.id } : {},
  jsonrpc: "2.0",
  method: req.method,
  result: await ethSignTransactionHandler(options)({
    from: req.params[0].from,
    ...req.params[0].to ? { to: req.params[0].to } : {},
    ...req.params[0].data ? { data: req.params[0].data } : {},
    ...req.params[0].value ? { value: hexToBigInt(req.params[0].value) } : {},
    ...req.params[0].gas ? { gas: hexToBigInt(req.params[0].gas) } : {},
    ...req.params[0].gasPrice ? { gasPrice: hexToBigInt(req.params[0].gasPrice) } : {},
    ...req.params[0].nonce ? { nonce: hexToBigInt(req.params[0].nonce) } : {}
  })
});

export { anvilDropTransactionJsonRpcProcedure, anvilDumpStateJsonRpcProcedure, anvilGetAutomineJsonRpcProcedure, anvilImpersonateAccountJsonRpcProcedure, anvilLoadStateJsonRpcProcedure, anvilResetJsonRpcProcedure, anvilSetBalanceJsonRpcProcedure, anvilSetChainIdJsonRpcProcedure, anvilSetCoinbaseJsonRpcProcedure, anvilSetNonceJsonRpcProcedure, anvilSetStorageAtJsonRpcProcedure, anvilStopImpersonatingAccountJsonRpcProcedure, blockNumberProcedure, blockToJsonRpcBlock, callProcedure, chainIdProcedure, debugTraceCallJsonRpcProcedure, debugTraceTransactionJsonRpcProcedure, dumpStateProcedure, ethAccountsProcedure, ethBlobBaseFeeJsonRpcProcedure, ethCallProcedure, ethCoinbaseJsonRpcProcedure, ethEstimateGasJsonRpcProcedure, ethGetBlockByHashJsonRpcProcedure, ethGetBlockByNumberJsonRpcProcedure, ethGetBlockTransactionCountByHashJsonRpcProcedure, ethGetBlockTransactionCountByNumberJsonRpcProcedure, ethGetFilterChangesProcedure, ethGetFilterLogsProcedure, ethGetLogsProcedure, ethGetTransactionByBlockHashAndIndexJsonRpcProcedure, ethGetTransactionByBlockNumberAndIndexJsonRpcProcedure, ethGetTransactionByHashJsonRpcProcedure, ethGetTransactionCountProcedure, ethGetTransactionReceiptJsonRpcProcedure, ethNewBlockFilterProcedure, ethNewFilterJsonRpcProcedure, ethNewPendingTransactionFilterProcedure, ethProtocolVersionJsonRpcProcedure, ethSendRawTransactionJsonRpcProcedure, ethSendTransactionJsonRpcProcedure, ethSignProcedure, ethSignTransactionProcedure, ethUninstallFilterJsonRpcProcedure, gasPriceProcedure, generateRandomId, getAccountProcedure, getBalanceProcedure, getCodeProcedure, getStorageAtProcedure, loadStateProcedure, mineProcedure, parseBlockTag, requestBulkProcedure, requestProcedure, scriptProcedure, setAccountProcedure, txToJsonRpcTx };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map