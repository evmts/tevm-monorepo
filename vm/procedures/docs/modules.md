[@tevm/procedures](README.md) / Exports

# @tevm/procedures

## Table of contents

### Classes

- [NoForkUrlSetError](classes/NoForkUrlSetError.md)

### Functions

- [accountHandler](modules.md#accounthandler)
- [accountProcedure](modules.md#accountprocedure)
- [blockNumberHandler](modules.md#blocknumberhandler)
- [blockNumberProcedure](modules.md#blocknumberprocedure)
- [callHandler](modules.md#callhandler)
- [callProcedure](modules.md#callprocedure)
- [chainIdHandler](modules.md#chainidhandler)
- [chainIdProcedure](modules.md#chainidprocedure)
- [contractHandler](modules.md#contracthandler)
- [contractProcedure](modules.md#contractprocedure)
- [dumpStateHandler](modules.md#dumpstatehandler)
- [dumpStateProcedure](modules.md#dumpstateprocedure)
- [gasPriceHandler](modules.md#gaspricehandler)
- [gasPriceProcedure](modules.md#gaspriceprocedure)
- [getBalanceHandler](modules.md#getbalancehandler)
- [getBalanceProcedure](modules.md#getbalanceprocedure)
- [getCodeHandler](modules.md#getcodehandler)
- [getCodeProcedure](modules.md#getcodeprocedure)
- [getStorageAtHandler](modules.md#getstorageathandler)
- [getStorageAtProcedure](modules.md#getstorageatprocedure)
- [loadStateHandler](modules.md#loadstatehandler)
- [loadStateProcedure](modules.md#loadstateprocedure)
- [requestProcedure](modules.md#requestprocedure)
- [scriptHandler](modules.md#scripthandler)
- [scriptProcedure](modules.md#scriptprocedure)

## Functions

### accountHandler

▸ **accountHandler**(`evm`): `AccountHandler`

Creates an AccountHandler for handling account params with Ethereumjs EVM

#### Parameters

| Name | Type |
| :------ | :------ |
| `evm` | `EVM` |

#### Returns

`AccountHandler`

#### Defined in

[vm/procedures/src/handlers/accountHandler.js:14](https://github.com/evmts/tevm-monorepo/blob/main/vm/procedures/src/handlers/accountHandler.js#L14)

___

### accountProcedure

▸ **accountProcedure**(`evm`): `AccountJsonRpcProcedure`

Creates an Account JSON-RPC Procedure for handling account requests with Ethereumjs EVM

#### Parameters

| Name | Type |
| :------ | :------ |
| `evm` | `EVM` |

#### Returns

`AccountJsonRpcProcedure`

#### Defined in

[vm/procedures/src/jsonrpc/accountProcedure.js:9](https://github.com/evmts/tevm-monorepo/blob/main/vm/procedures/src/jsonrpc/accountProcedure.js#L9)

___

### blockNumberHandler

▸ **blockNumberHandler**(`blockchain`): `EthBlockNumberHandler`

#### Parameters

| Name | Type |
| :------ | :------ |
| `blockchain` | `BlockchainInterface` |

#### Returns

`EthBlockNumberHandler`

#### Defined in

[vm/procedures/src/handlers/eth/blockNumberHandler.js:5](https://github.com/evmts/tevm-monorepo/blob/main/vm/procedures/src/handlers/eth/blockNumberHandler.js#L5)

___

### blockNumberProcedure

▸ **blockNumberProcedure**(`blockchain`): `EthBlockNumberJsonRpcProcedure`

#### Parameters

| Name | Type |
| :------ | :------ |
| `blockchain` | `BlockchainInterface` |

#### Returns

`EthBlockNumberJsonRpcProcedure`

#### Defined in

[vm/procedures/src/jsonrpc/eth/blockNumberProcedure.js:8](https://github.com/evmts/tevm-monorepo/blob/main/vm/procedures/src/jsonrpc/eth/blockNumberProcedure.js#L8)

___

### callHandler

▸ **callHandler**(`evm`): `CallHandler`

Creates an CallHandler for handling call params with Ethereumjs EVM

#### Parameters

| Name | Type |
| :------ | :------ |
| `evm` | `EVM` |

#### Returns

`CallHandler`

#### Defined in

[vm/procedures/src/handlers/callHandler.js:10](https://github.com/evmts/tevm-monorepo/blob/main/vm/procedures/src/handlers/callHandler.js#L10)

___

### callProcedure

▸ **callProcedure**(`evm`): `CallJsonRpcProcedure`

Creates a Call JSON-RPC Procedure for handling call requests with Ethereumjs EVM

#### Parameters

| Name | Type |
| :------ | :------ |
| `evm` | `EVM` |

#### Returns

`CallJsonRpcProcedure`

#### Defined in

[vm/procedures/src/jsonrpc/callProcedure.js:10](https://github.com/evmts/tevm-monorepo/blob/main/vm/procedures/src/jsonrpc/callProcedure.js#L10)

___

### chainIdHandler

▸ **chainIdHandler**(`chainId`): `EthBlockNumberHandler`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainId` | `bigint` |

#### Returns

`EthBlockNumberHandler`

#### Defined in

[vm/procedures/src/handlers/eth/chainIdHandler.js:5](https://github.com/evmts/tevm-monorepo/blob/main/vm/procedures/src/handlers/eth/chainIdHandler.js#L5)

___

### chainIdProcedure

▸ **chainIdProcedure**(`chainId`): `EthChainIdJsonRpcProcedure`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainId` | `bigint` |

#### Returns

`EthChainIdJsonRpcProcedure`

#### Defined in

[vm/procedures/src/jsonrpc/eth/chainIdProcedure.js:8](https://github.com/evmts/tevm-monorepo/blob/main/vm/procedures/src/jsonrpc/eth/chainIdProcedure.js#L8)

___

### contractHandler

▸ **contractHandler**(`evm`): `ContractHandler`

Creates an ContractHandler for handling contract params with Ethereumjs EVM

#### Parameters

| Name | Type |
| :------ | :------ |
| `evm` | `EVM` |

#### Returns

`ContractHandler`

#### Defined in

[vm/procedures/src/handlers/contractHandler.js:16](https://github.com/evmts/tevm-monorepo/blob/main/vm/procedures/src/handlers/contractHandler.js#L16)

___

### contractProcedure

▸ **contractProcedure**(`evm`): `CallJsonRpcProcedure`

Creates a Contract JSON-RPC Procedure for handling contract requests with Ethereumjs EVM
Because the Contract handler is a quality of life wrapper around a call for the JSON rpc interface
we simply overload call instead of creating a seperate tevm_contract method

#### Parameters

| Name | Type |
| :------ | :------ |
| `evm` | `EVM` |

#### Returns

`CallJsonRpcProcedure`

#### Defined in

[vm/procedures/src/jsonrpc/callProcedure.js:10](https://github.com/evmts/tevm-monorepo/blob/main/vm/procedures/src/jsonrpc/callProcedure.js#L10)

___

### dumpStateHandler

▸ **dumpStateHandler**(`stateManager`): `DumpStateHandler`

#### Parameters

| Name | Type |
| :------ | :------ |
| `stateManager` | `TevmStateManager` \| `DefaultTevmStateManager` |

#### Returns

`DumpStateHandler`

#### Defined in

[vm/procedures/src/handlers/dumpStateHandler.js:9](https://github.com/evmts/tevm-monorepo/blob/main/vm/procedures/src/handlers/dumpStateHandler.js#L9)

___

### dumpStateProcedure

▸ **dumpStateProcedure**(`stateManager`): `DumpStateJsonRpcProcedure`

Creates a DumpState JSON-RPC Procedure for handling dumpState requests with Ethereumjs EVM

#### Parameters

| Name | Type |
| :------ | :------ |
| `stateManager` | `TevmStateManager` |

#### Returns

`DumpStateJsonRpcProcedure`

#### Defined in

[vm/procedures/src/jsonrpc/dumpStateProcedure.js:9](https://github.com/evmts/tevm-monorepo/blob/main/vm/procedures/src/jsonrpc/dumpStateProcedure.js#L9)

___

### gasPriceHandler

▸ **gasPriceHandler**(`options`): `EthGasPriceHandler`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.blockchain` | `Blockchain` |
| `options.forkUrl` | `undefined` \| `string` |

#### Returns

`EthGasPriceHandler`

#### Defined in

[vm/procedures/src/handlers/eth/gasPriceHandler.js:11](https://github.com/evmts/tevm-monorepo/blob/main/vm/procedures/src/handlers/eth/gasPriceHandler.js#L11)

___

### gasPriceProcedure

▸ **gasPriceProcedure**(`options`): `EthGasPriceJsonRpcProcedure`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.blockchain` | `Blockchain` |
| `options.forkUrl` | `undefined` \| `string` |

#### Returns

`EthGasPriceJsonRpcProcedure`

#### Defined in

[vm/procedures/src/jsonrpc/eth/gasPriceProcedure.js:9](https://github.com/evmts/tevm-monorepo/blob/main/vm/procedures/src/jsonrpc/eth/gasPriceProcedure.js#L9)

___

### getBalanceHandler

▸ **getBalanceHandler**(`options`): `EthGetBalanceHandler`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.forkUrl` | `undefined` \| `string` |
| `options.stateManager` | `EVMStateManagerInterface` |

#### Returns

`EthGetBalanceHandler`

#### Defined in

[vm/procedures/src/handlers/eth/getBalanceHandler.js:24](https://github.com/evmts/tevm-monorepo/blob/main/vm/procedures/src/handlers/eth/getBalanceHandler.js#L24)

___

### getBalanceProcedure

▸ **getBalanceProcedure**(`options`): `EthGetBalanceJsonRpcProcedure`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.forkUrl` | `undefined` \| `string` |
| `options.stateManager` | `EVMStateManagerInterface` |

#### Returns

`EthGetBalanceJsonRpcProcedure`

#### Defined in

[vm/procedures/src/jsonrpc/eth/getBalanceProcedure.js:9](https://github.com/evmts/tevm-monorepo/blob/main/vm/procedures/src/jsonrpc/eth/getBalanceProcedure.js#L9)

___

### getCodeHandler

▸ **getCodeHandler**(`options`): `EthGetCodeHandler`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.forkUrl` | `undefined` \| `string` |
| `options.stateManager` | `EVMStateManagerInterface` |

#### Returns

`EthGetCodeHandler`

#### Defined in

[vm/procedures/src/handlers/eth/getCodeHandler.js:12](https://github.com/evmts/tevm-monorepo/blob/main/vm/procedures/src/handlers/eth/getCodeHandler.js#L12)

___

### getCodeProcedure

▸ **getCodeProcedure**(`options`): `EthGetCodeJsonRpcProcedure`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.forkUrl` | `undefined` \| `string` |
| `options.stateManager` | `EVMStateManagerInterface` |

#### Returns

`EthGetCodeJsonRpcProcedure`

#### Defined in

[vm/procedures/src/jsonrpc/eth/getCodeProcedure.js:8](https://github.com/evmts/tevm-monorepo/blob/main/vm/procedures/src/jsonrpc/eth/getCodeProcedure.js#L8)

___

### getStorageAtHandler

▸ **getStorageAtHandler**(`options`): `EthGetStorageAtHandler`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.forkUrl` | `undefined` \| `string` |
| `options.stateManager` | `EVMStateManagerInterface` |

#### Returns

`EthGetStorageAtHandler`

#### Defined in

[vm/procedures/src/handlers/eth/getStorageAtHandler.js:13](https://github.com/evmts/tevm-monorepo/blob/main/vm/procedures/src/handlers/eth/getStorageAtHandler.js#L13)

___

### getStorageAtProcedure

▸ **getStorageAtProcedure**(`options`): `EthGetStorageAtJsonRpcProcedure`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.forkUrl` | `undefined` \| `string` |
| `options.stateManager` | `EVMStateManagerInterface` |

#### Returns

`EthGetStorageAtJsonRpcProcedure`

#### Defined in

[vm/procedures/src/jsonrpc/eth/getStorageAtProcedure.js:8](https://github.com/evmts/tevm-monorepo/blob/main/vm/procedures/src/jsonrpc/eth/getStorageAtProcedure.js#L8)

___

### loadStateHandler

▸ **loadStateHandler**(`stateManager`): `LoadStateHandler`

#### Parameters

| Name | Type |
| :------ | :------ |
| `stateManager` | `TevmStateManager` \| `DefaultTevmStateManager` |

#### Returns

`LoadStateHandler`

#### Defined in

[vm/procedures/src/handlers/loadStateHandler.js:11](https://github.com/evmts/tevm-monorepo/blob/main/vm/procedures/src/handlers/loadStateHandler.js#L11)

___

### loadStateProcedure

▸ **loadStateProcedure**(`stateManager`): `LoadStateJsonRpcProcedure`

Creates a LoadState JSON-RPC Procedure for handling LoadState requests with Ethereumjs EVM

#### Parameters

| Name | Type |
| :------ | :------ |
| `stateManager` | `TevmStateManager` |

#### Returns

`LoadStateJsonRpcProcedure`

#### Defined in

[vm/procedures/src/jsonrpc/loadStateProcedure.js:9](https://github.com/evmts/tevm-monorepo/blob/main/vm/procedures/src/jsonrpc/loadStateProcedure.js#L9)

___

### requestProcedure

▸ **requestProcedure**(`vm`): `TevmJsonRpcRequestHandler`

Handles a single tevm json rpc request
Infers return type from request

#### Parameters

| Name | Type |
| :------ | :------ |
| `vm` | `VM` |

#### Returns

`TevmJsonRpcRequestHandler`

**`Example`**

```typescript
const res = await requestProcedure(evm)({
 jsonrpc: '2.0',
 id: '1',
 method: 'tevm_call',
 params: {
   to: '0x000000000'
 }
})
```

#### Defined in

[vm/procedures/src/requestProcedure.js:33](https://github.com/evmts/tevm-monorepo/blob/main/vm/procedures/src/requestProcedure.js#L33)

___

### scriptHandler

▸ **scriptHandler**(`evm`): `ScriptHandler`

Creates an ScriptHandler for handling script params with Ethereumjs EVM

#### Parameters

| Name | Type |
| :------ | :------ |
| `evm` | `EVM` |

#### Returns

`ScriptHandler`

#### Defined in

[vm/procedures/src/handlers/scriptHandler.js:17](https://github.com/evmts/tevm-monorepo/blob/main/vm/procedures/src/handlers/scriptHandler.js#L17)

___

### scriptProcedure

▸ **scriptProcedure**(`evm`): `ScriptJsonRpcProcedure`

Creates a Script JSON-RPC Procedure for handling script requests with Ethereumjs EVM

#### Parameters

| Name | Type |
| :------ | :------ |
| `evm` | `EVM` |

#### Returns

`ScriptJsonRpcProcedure`

#### Defined in

[vm/procedures/src/jsonrpc/scriptProcedure.js:10](https://github.com/evmts/tevm-monorepo/blob/main/vm/procedures/src/jsonrpc/scriptProcedure.js#L10)
