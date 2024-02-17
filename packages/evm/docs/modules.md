[@tevm/evm](README.md) / Exports

# @tevm/evm

## Table of contents

### Enumerations

- [EvmErrorMessage](enums/EvmErrorMessage.md)

### Classes

- [EthjsMessage](classes/EthjsMessage.md)
- [Evm](classes/Evm.md)

### Interfaces

- [EvmResult](interfaces/EvmResult.md)
- [ExecResult](interfaces/ExecResult.md)
- [InterpreterStep](interfaces/InterpreterStep.md)
- [PrecompileInput](interfaces/PrecompileInput.md)

### Type Aliases

- [ConstructorArgument](modules.md#constructorargument)
- [CreateEvmOptions](modules.md#createevmoptions)
- [CustomPrecompile](modules.md#customprecompile)
- [EthjsLog](modules.md#ethjslog)

### Variables

- [Eof](modules.md#eof)

### Functions

- [createEvm](modules.md#createevm)

## Type Aliases

### ConstructorArgument

Ƭ **ConstructorArgument**\<`T`\>: `T` extends (...`args`: infer P) => `any` ? `P`[``0``] : `never`

Infers the the first argument of a class

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[packages/evm/src/CustomPrecompile.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/packages/evm/src/CustomPrecompile.ts#L4)

___

### CreateEvmOptions

Ƭ **CreateEvmOptions**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `allowUnlimitedContractSize?` | `boolean` | Enable/disable unlimited contract size. Defaults to false. |
| `blockchain` | `TevmBlockchain` | - |
| `common` | `TevmCommon` | Ethereumjs common object |
| `customPrecompiles?` | [`CustomPrecompile`](modules.md#customprecompile)[] | Custom precompiles allow you to run arbitrary JavaScript code in the EVM. See the [Precompile guide](https://todo.todo) documentation for a deeper dive An ever growing standard library of precompiles is provided at `tevm/precompiles` **`Notice`** Not implemented yet [Implementation pr](https://github.com/evmts/tevm-monorepo/pull/728/files) Below example shows how to make a precompile so you can call `fs.writeFile` and `fs.readFile` in your contracts. Note: this specific precompile is also provided in the standard library For security precompiles can only be added statically when the vm is created. **`Example`** ```ts import { createMemoryClient, defineCall, definePrecompile } from 'tevm' import { createScript } from '@tevm/contract' import fs from 'fs/promises' const Fs = createScript({ name: 'Fs', humanReadableAbi: [ 'function readFile(string path) returns (string)', 'function writeFile(string path, string data) returns (bool)', ] }) const fsPrecompile = definePrecompile({ contract: Fs, address: '0xf2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2', call: defineCall(Fs.abi, { readFile: async ({ args }) => { return { returnValue: await fs.readFile(...args, 'utf8'), executionGasUsed: 0n, } }, writeFile: async ({ args }) => { await fs.writeFile(...args) return { returnValue: true, executionGasUsed: 0n } }, }), }) const tevm = createMemoryClient({ customPrecompiles: [fsPrecompile] }) |
| `customPredeploys?` | `ReadonlyArray`\<`CustomPredeploy`\<`any`, `any`\>\> | Custom predeploys allow you to deploy arbitrary EVM bytecode to an address. This is a convenience method and equivalent to calling tevm.setAccount() manually to set the contract code. ```typescript const tevm = createMemoryClient({ customPredeploys: [ // can pass a `tevm Script` here as well { address: '0x420420...', abi: [...], deployedBytecode: '0x420420...', } ], }) ``` |
| `profiler?` | `boolean` | Enable profiler. Defaults to false. |
| `stateManager` | `TevmStateManager` | A custom Tevm state manager |

#### Defined in

[packages/evm/src/CreateEvmOptions.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/evm/src/CreateEvmOptions.ts#L7)

___

### CustomPrecompile

Ƭ **CustomPrecompile**: `Exclude`\<`Exclude`\<[`ConstructorArgument`](modules.md#constructorargument)\<`EVM`\>, `undefined`\>[``"customPrecompiles"``], `undefined`\>[`number`]

Custom precompiles allow you to run arbitrary JavaScript code in the EVM

#### Defined in

[packages/evm/src/CustomPrecompile.ts:19](https://github.com/evmts/tevm-monorepo/blob/main/packages/evm/src/CustomPrecompile.ts#L19)

___

### EthjsLog

Ƭ **EthjsLog**: [address: Uint8Array, topics: Uint8Array[], data: Uint8Array]

Log that the contract emits.

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/types.d.ts:294

## Variables

### Eof

• `Const` **Eof**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `FORMAT` | `number` |
| `MAGIC` | `number` |
| `VERSION` | `number` |
| `codeAnalysis` | (`container`: `Uint8Array`) => \{ `code`: `number` ; `data`: `number`  } \| `undefined` |
| `validOpcodes` | (`code`: `Uint8Array`) => `boolean` |

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/eof.d.ts:18

## Functions

### createEvm

▸ **createEvm**(`options`): [`Evm`](classes/Evm.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`CreateEvmOptions`](modules.md#createevmoptions) |

#### Returns

[`Evm`](classes/Evm.md)

#### Defined in

[packages/evm/src/createEvm.js:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/evm/src/createEvm.js#L7)
