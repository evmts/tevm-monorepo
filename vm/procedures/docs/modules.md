[@tevm/procedures](README.md) / Exports

# @tevm/procedures

## Table of contents

### Functions

- [accountHandler](modules.md#accounthandler)
- [accountProcedure](modules.md#accountprocedure)
- [blockNumberHandler](modules.md#blocknumberhandler)
- [blockNumberProcedure](modules.md#blocknumberprocedure)
- [callHandler](modules.md#callhandler)
- [callProcedure](modules.md#callprocedure)
- [contractHandler](modules.md#contracthandler)
- [contractProcedure](modules.md#contractprocedure)
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

[handlers/accountHandler.js:14](https://github.com/evmts/tevm-monorepo/blob/main/vm/procedures/src/handlers/accountHandler.js#L14)

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

[jsonrpc/accountProcedure.js:9](https://github.com/evmts/tevm-monorepo/blob/main/vm/procedures/src/jsonrpc/accountProcedure.js#L9)

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

handlers/ethHandler.js:5

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

jsonrpc/ethProcedure.js:8

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

[handlers/callHandler.js:10](https://github.com/evmts/tevm-monorepo/blob/main/vm/procedures/src/handlers/callHandler.js#L10)

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

[jsonrpc/callProcedure.js:10](https://github.com/evmts/tevm-monorepo/blob/main/vm/procedures/src/jsonrpc/callProcedure.js#L10)

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

[handlers/contractHandler.js:16](https://github.com/evmts/tevm-monorepo/blob/main/vm/procedures/src/handlers/contractHandler.js#L16)

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

[jsonrpc/callProcedure.js:10](https://github.com/evmts/tevm-monorepo/blob/main/vm/procedures/src/jsonrpc/callProcedure.js#L10)

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

[requestProcedure.js:22](https://github.com/evmts/tevm-monorepo/blob/main/vm/procedures/src/requestProcedure.js#L22)

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

[handlers/scriptHandler.js:17](https://github.com/evmts/tevm-monorepo/blob/main/vm/procedures/src/handlers/scriptHandler.js#L17)

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

[jsonrpc/scriptProcedure.js:10](https://github.com/evmts/tevm-monorepo/blob/main/vm/procedures/src/jsonrpc/scriptProcedure.js#L10)
