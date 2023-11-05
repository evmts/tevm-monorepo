[@evmts/vm](../README.md) / [Exports](../modules.md) / EVMts

# Class: EVMts

A local EVM instance running in JavaScript. Similar to Anvil in your browser

**`Example`**

```ts
import { EVMts } from "evmts"
import { createPublicClient, http } from "viem"
import { MyERC721 } from './MyERC721.sol'

const evmts = EVMts.create({
	fork: {
	  url: "https://mainnet.optimism.io",
	},
})

const address = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',

await evmts.runContractCall(
  MyERC721.write.mint({
    caller: address,
  }),
)

const balance = await evmts.runContractCall(
 MyERC721.read.balanceOf({
 caller: address,
 }),
 )
 console.log(balance) // 1n

## Table of contents

### Constructors

- [constructor](EVMts.md#constructor)

### Properties

- [\_evm](EVMts.md#_evm)
- [isCreating](EVMts.md#iscreating)

### Methods

- [putAccount](EVMts.md#putaccount)
- [putContractCode](EVMts.md#putcontractcode)
- [runCall](EVMts.md#runcall)
- [runContractCall](EVMts.md#runcontractcall)
- [runScript](EVMts.md#runscript)
- [create](EVMts.md#create)

## Constructors

### constructor

• **new EVMts**(`stateManager`, `common?`, `_evm?`): [`EVMts`](EVMts.md)

A local EVM instance running in JavaScript. Similar to Anvil in your browser

#### Parameters

| Name | Type |
| :------ | :------ |
| `stateManager` | `DefaultStateManager` \| `EthersStateManager` |
| `common` | `Common` |
| `_evm` | `EVM` |

#### Returns

[`EVMts`](EVMts.md)

#### Defined in

[evmts.ts:111](https://github.com/evmts/evmts-monorepo/blob/main/packages/vm/src/evmts.ts#L111)

## Properties

### \_evm

• `Readonly` **\_evm**: `EVM`

#### Defined in

[evmts.ts:114](https://github.com/evmts/evmts-monorepo/blob/main/packages/vm/src/evmts.ts#L114)

___

### isCreating

▪ `Static` `Private` **isCreating**: `boolean` = `false`

Makes sure evmts is invoked with EVMts.create and not with new EVMts

#### Defined in

[evmts.ts:81](https://github.com/evmts/evmts-monorepo/blob/main/packages/vm/src/evmts.ts#L81)

## Methods

### putAccount

▸ **putAccount**(`parameters`): `Promise`\<`Account`\>

Puts an account with ether balance into the state

#### Parameters

| Name | Type |
| :------ | :------ |
| `parameters` | [`PutAccountParameters`](../modules.md#putaccountparameters) |

#### Returns

`Promise`\<`Account`\>

**`Example`**

```ts
evmts.putAccount({
	address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
	balance: 100n,
})

#### Defined in

[evmts.ts:173](https://github.com/evmts/evmts-monorepo/blob/main/packages/vm/src/evmts.ts#L173)

___

### putContractCode

▸ **putContractCode**(`parameters`): `Promise`\<`Uint8Array`\>

Puts a contract into the state

#### Parameters

| Name | Type |
| :------ | :------ |
| `parameters` | [`PutContractCodeParameters`](../modules.md#putcontractcodeparameters) |

#### Returns

`Promise`\<`Uint8Array`\>

**`Example`**

```ts
evmts.putContract({
 bytecode,
 contractAddress,
})

#### Defined in

[evmts.ts:186](https://github.com/evmts/evmts-monorepo/blob/main/packages/vm/src/evmts.ts#L186)

___

### runCall

▸ **runCall**(`parameters`): `Promise`\<`EVMResult`\>

Executes a call on the EVM

#### Parameters

| Name | Type |
| :------ | :------ |
| `parameters` | [`RunCallParameters`](../modules.md#runcallparameters) |

#### Returns

`Promise`\<`EVMResult`\>

**`Example`**

```ts
const result = await evmts.runCall({
  data: '0x...',
  caller: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
  gasLimit: 1000000n,
  value: 10000000000000000n,
})

#### Defined in

[evmts.ts:204](https://github.com/evmts/evmts-monorepo/blob/main/packages/vm/src/evmts.ts#L204)

___

### runContractCall

▸ **runContractCall**\<`TAbi`, `TFunctionName`\>(`parameters`): `Promise`\<[`RunContractCallResult`](../modules.md#runcontractcallresult)\<`TAbi`, `TFunctionName`\>\>

Calls contract code using an ABI and returns the decoded result

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends `Abi` \| readonly `unknown`[] = `Abi` |
| `TFunctionName` | extends `string` = `string` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `parameters` | [`RunContractCallParameters`](../modules.md#runcontractcallparameters)\<`TAbi`, `TFunctionName`\> |

#### Returns

`Promise`\<[`RunContractCallResult`](../modules.md#runcontractcallresult)\<`TAbi`, `TFunctionName`\>\>

**`Example`**

```ts
const result = await evmts.runContractCall({
 abi: MyContract.abi,
 contractAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
 functionName: 'balanceOf',
 args: ['0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'],
})

#### Defined in

[evmts.ts:219](https://github.com/evmts/evmts-monorepo/blob/main/packages/vm/src/evmts.ts#L219)

___

### runScript

▸ **runScript**\<`TAbi`, `TFunctionName`\>(`parameters`): `Promise`\<[`RunScriptResult`](../modules.md#runscriptresult)\<`TAbi`, `TFunctionName`\>\>

Runs a script or contract that is not deployed to the chain
The recomended way to use a script is with an EVMts import

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends `Abi` \| readonly `unknown`[] = `Abi` |
| `TFunctionName` | extends `string` = `string` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `parameters` | [`RunScriptParameters`](../modules.md#runscriptparameters)\<`TAbi`, `TFunctionName`\> |

#### Returns

`Promise`\<[`RunScriptResult`](../modules.md#runscriptresult)\<`TAbi`, `TFunctionName`\>\>

**`Example`**

```ts
// Scripts require bytecode
import { MyContractOrScript } from './MyContractOrScript.sol' with {
  evmts: 'bytecode'
}
evmts.runScript(
  MyContractOrScript.script.run()
)
```
Scripts can also be called directly via passing in args

**`Example`**

```ts
evmts.runScript({
  bytecode,
  abi,
  functionName: 'run',
})
```

#### Defined in

[evmts.ts:155](https://github.com/evmts/evmts-monorepo/blob/main/packages/vm/src/evmts.ts#L155)

___

### create

▸ **create**(`options?`): `Promise`\<[`EVMts`](EVMts.md)\>

Creates a [EVMts](EVMts.md) instance

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`CreateEVMOptions`](../modules.md#createevmoptions) |

#### Returns

`Promise`\<[`EVMts`](EVMts.md)\>

#### Defined in

[evmts.ts:86](https://github.com/evmts/evmts-monorepo/blob/main/packages/vm/src/evmts.ts#L86)
