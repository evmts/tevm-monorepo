[@tevm/action-handlers](README.md) / Exports

# @tevm/action-handlers

## Table of contents

### Functions

- [putAccountHandler](modules.md#putaccounthandler)
- [putContractCodeHandler](modules.md#putcontractcodehandler)
- [runCallHandler](modules.md#runcallhandler)
- [runContractCallHandler](modules.md#runcontractcallhandler)
- [runScriptHandler](modules.md#runscripthandler)

## Functions

### putAccountHandler

▸ **putAccountHandler**(`evm`, `action`): `Promise`\<`Account`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `evm` | `EVM` |
| `action` | `PutAccountAction` |

#### Returns

`Promise`\<`Account`\>

#### Defined in

[putAccountHandler.js:13](https://github.com/evmts/tevm-monorepo/blob/main/vm/action-handlers/src/putAccountHandler.js#L13)

___

### putContractCodeHandler

▸ **putContractCodeHandler**(`evm`, `action`): `Promise`\<`Uint8Array`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `evm` | `EVM` |
| `action` | `PutContractCodeAction` |

#### Returns

`Promise`\<`Uint8Array`\>

#### Defined in

[putContractCodeHandler.js:9](https://github.com/evmts/tevm-monorepo/blob/main/vm/action-handlers/src/putContractCodeHandler.js#L9)

___

### runCallHandler

▸ **runCallHandler**(`evm`, `action`): `Promise`\<`EVMResult`\>

Executes a call on the vm

#### Parameters

| Name | Type |
| :------ | :------ |
| `evm` | `EVM` |
| `action` | `RunCallAction` |

#### Returns

`Promise`\<`EVMResult`\>

#### Defined in

[runCallHandler.js:10](https://github.com/evmts/tevm-monorepo/blob/main/vm/action-handlers/src/runCallHandler.js#L10)

___

### runContractCallHandler

▸ **runContractCallHandler**\<`TAbi`, `TFunctionName`\>(`evm`, `action`): `Promise`\<`RunContractCallResponse`\<`TAbi`, `TFunctionName`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends `Abi` \| readonly `unknown`[] = `Abi` |
| `TFunctionName` | extends `string` = `string` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `evm` | `EVM` |
| `action` | `RunContractCallAction`\<`TAbi`, `TFunctionName`\> |

#### Returns

`Promise`\<`RunContractCallResponse`\<`TAbi`, `TFunctionName`\>\>

#### Defined in

[RunContractCallHandlerGeneric.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/vm/action-handlers/src/RunContractCallHandlerGeneric.ts#L8)

___

### runScriptHandler

▸ **runScriptHandler**\<`TAbi`, `TFunctionName`\>(`evm`, `«destructured»`): `Promise`\<`RunScriptResponse`\<`TAbi`, `TFunctionName`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends `Abi` \| readonly `unknown`[] = `Abi` |
| `TFunctionName` | extends `string` = `string` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `evm` | `EVM` |
| `«destructured»` | `RunScriptAction`\<`TAbi`, `TFunctionName`\> |

#### Returns

`Promise`\<`RunScriptResponse`\<`TAbi`, `TFunctionName`\>\>

#### Defined in

[RunScriptHandlerGeneric.ts:5](https://github.com/evmts/tevm-monorepo/blob/main/vm/action-handlers/src/RunScriptHandlerGeneric.ts#L5)
