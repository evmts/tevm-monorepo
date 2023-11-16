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
 ```

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

• **new EVMts**(`stateManager`, `common?`, `customPrecompiles?`, `_evm?`): [`EVMts`](EVMts.md)

A local EVM instance running in JavaScript. Similar to Anvil in your browser

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `stateManager` | `DefaultStateManager` \| `ViemStateManager` | `undefined` |
| `common` | `Common` | `undefined` |
| `customPrecompiles` | `CustomPrecompile`[] | `[]` |
| `_evm` | `EVM` | `undefined` |

#### Returns

[`EVMts`](EVMts.md)

#### Defined in

[evmts.ts:133](https://github.com/evmts/evmts-monorepo/blob/main/vm/src/evmts.ts#L133)

## Properties

### \_evm

• `Readonly` **\_evm**: `EVM`

#### Defined in

[evmts.ts:137](https://github.com/evmts/evmts-monorepo/blob/main/vm/src/evmts.ts#L137)

___

### isCreating

▪ `Static` `Private` **isCreating**: `boolean` = `false`

Makes sure evmts is invoked with EVMts.create and not with new EVMts

#### Defined in

[evmts.ts:101](https://github.com/evmts/evmts-monorepo/blob/main/vm/src/evmts.ts#L101)

## Methods

### putAccount

▸ **putAccount**(`action`): `Promise`\<`Account`\>

Puts an account with ether balance into the state

#### Parameters

| Name | Type |
| :------ | :------ |
| `action` | [`PutAccountAction`](../modules.md#putaccountaction) |

#### Returns

`Promise`\<`Account`\>

**`Example`**

```ts
evmts.putAccount({
	address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
	balance: 100n,
})
```

#### Defined in

[evmts.ts:198](https://github.com/evmts/evmts-monorepo/blob/main/vm/src/evmts.ts#L198)

___

### putContractCode

▸ **putContractCode**(`action`): `Promise`\<`Uint8Array`\>

Puts a contract into the state

#### Parameters

| Name | Type |
| :------ | :------ |
| `action` | [`PutContractCodeAction`](../modules.md#putcontractcodeaction) |

#### Returns

`Promise`\<`Uint8Array`\>

**`Example`**

```ts
evmts.putContract({
 bytecode,
 contractAddress,
})
```

#### Defined in

[evmts.ts:212](https://github.com/evmts/evmts-monorepo/blob/main/vm/src/evmts.ts#L212)

___

### runCall

▸ **runCall**(`action`): `Promise`\<`EVMResult`\>

Executes a call on the EVM

#### Parameters

| Name | Type |
| :------ | :------ |
| `action` | [`RunCallAction`](../modules.md#runcallaction) |

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
```

#### Defined in

[evmts.ts:228](https://github.com/evmts/evmts-monorepo/blob/main/vm/src/evmts.ts#L228)

___

### runContractCall

▸ **runContractCall**\<`TAbi`, `TFunctionName`\>(`action`): `Promise`\<[`RunContractCallResult`](../modules.md#runcontractcallresult)\<`TAbi`, `TFunctionName`\>\>

Calls contract code using an ABI and returns the decoded result

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends `Abi` \| readonly `unknown`[] = `Abi` |
| `TFunctionName` | extends `string` = `string` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `action` | [`RunContractCallAction`](../modules.md#runcontractcallaction)\<`TAbi`, `TFunctionName`\> |

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
```

#### Defined in

[evmts.ts:244](https://github.com/evmts/evmts-monorepo/blob/main/vm/src/evmts.ts#L244)

___

### runScript

▸ **runScript**\<`TAbi`, `TFunctionName`\>(`action`): `Promise`\<[`RunScriptResult`](../modules.md#runscriptresult)\<`TAbi`, `TFunctionName`\>\>

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
| `action` | [`RunScriptAction`](../modules.md#runscriptaction)\<`TAbi`, `TFunctionName`\> |

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

[evmts.ts:179](https://github.com/evmts/evmts-monorepo/blob/main/vm/src/evmts.ts#L179)

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

[evmts.ts:106](https://github.com/evmts/evmts-monorepo/blob/main/vm/src/evmts.ts#L106)
