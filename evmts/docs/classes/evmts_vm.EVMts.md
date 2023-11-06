[Documentation](../README.md) / [Modules](../modules.md) / [@evmts/vm](../modules/evmts_vm.md) / EVMts

# Class: EVMts

[@evmts/vm](../modules/evmts_vm.md).EVMts

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

- [constructor](evmts_vm.EVMts.md#constructor)

### Properties

- [\_evm](evmts_vm.EVMts.md#_evm)
- [isCreating](evmts_vm.EVMts.md#iscreating)

### Methods

- [putAccount](evmts_vm.EVMts.md#putaccount)
- [putContractCode](evmts_vm.EVMts.md#putcontractcode)
- [runCall](evmts_vm.EVMts.md#runcall)
- [runContractCall](evmts_vm.EVMts.md#runcontractcall)
- [runScript](evmts_vm.EVMts.md#runscript)
- [create](evmts_vm.EVMts.md#create)

## Constructors

### constructor

• **new EVMts**(`stateManager`, `common?`, `_evm?`): [`EVMts`](evmts_vm.EVMts.md)

A local EVM instance running in JavaScript. Similar to Anvil in your browser

#### Parameters

| Name | Type |
| :------ | :------ |
| `stateManager` | `DefaultStateManager` \| `EthersStateManager` |
| `common` | `Common` |
| `_evm` | `EVM` |

#### Returns

[`EVMts`](evmts_vm.EVMts.md)

#### Defined in

[evmts.ts:110](https://github.com/evmts/evmts-monorepo/blob/main/packages/vm/src/evmts.ts#L110)

## Properties

### \_evm

• `Readonly` **\_evm**: `EVM`

#### Defined in

[evmts.ts:113](https://github.com/evmts/evmts-monorepo/blob/main/packages/vm/src/evmts.ts#L113)

___

### isCreating

▪ `Private` `Static` **isCreating**: `boolean` = `false`

Makes sure evmts is invoked with EVMts.create and not with new EVMts

#### Defined in

[evmts.ts:80](https://github.com/evmts/evmts-monorepo/blob/main/packages/vm/src/evmts.ts#L80)

## Methods

### putAccount

▸ **putAccount**(`action`): `Promise`\<`Account`\>

Puts an account with ether balance into the state

#### Parameters

| Name | Type |
| :------ | :------ |
| `action` | [`PutAccountAction`](../modules/evmts_vm.md#putaccountaction) |

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

[evmts.ts:173](https://github.com/evmts/evmts-monorepo/blob/main/packages/vm/src/evmts.ts#L173)

___

### putContractCode

▸ **putContractCode**(`action`): `Promise`\<`Uint8Array`\>

Puts a contract into the state

#### Parameters

| Name | Type |
| :------ | :------ |
| `action` | [`PutContractCodeAction`](../modules/evmts_vm.md#putcontractcodeaction) |

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

[evmts.ts:187](https://github.com/evmts/evmts-monorepo/blob/main/packages/vm/src/evmts.ts#L187)

___

### runCall

▸ **runCall**(`action`): `Promise`\<`EVMResult`\>

Executes a call on the EVM

#### Parameters

| Name | Type |
| :------ | :------ |
| `action` | [`RunCallAction`](../modules/evmts_vm.md#runcallaction) |

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

[evmts.ts:203](https://github.com/evmts/evmts-monorepo/blob/main/packages/vm/src/evmts.ts#L203)

___

### runContractCall

▸ **runContractCall**\<`TAbi`, `TFunctionName`\>(`action`): `Promise`\<[`RunContractCallResult`](../modules/evmts_vm.md#runcontractcallresult)\<`TAbi`, `TFunctionName`\>\>

Calls contract code using an ABI and returns the decoded result

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends `Abi` \| readonly `unknown`[] = `Abi` |
| `TFunctionName` | extends `string` = `string` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `action` | [`RunContractCallAction`](../modules/evmts_vm.md#runcontractcallaction)\<`TAbi`, `TFunctionName`\> |

#### Returns

`Promise`\<[`RunContractCallResult`](../modules/evmts_vm.md#runcontractcallresult)\<`TAbi`, `TFunctionName`\>\>

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

[evmts.ts:219](https://github.com/evmts/evmts-monorepo/blob/main/packages/vm/src/evmts.ts#L219)

___

### runScript

▸ **runScript**\<`TAbi`, `TFunctionName`\>(`action`): `Promise`\<[`RunScriptResult`](../modules/evmts_vm.md#runscriptresult)\<`TAbi`, `TFunctionName`\>\>

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
| `action` | [`RunScriptAction`](../modules/evmts_vm.md#runscriptaction)\<`TAbi`, `TFunctionName`\> |

#### Returns

`Promise`\<[`RunScriptResult`](../modules/evmts_vm.md#runscriptresult)\<`TAbi`, `TFunctionName`\>\>

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

[evmts.ts:154](https://github.com/evmts/evmts-monorepo/blob/main/packages/vm/src/evmts.ts#L154)

___

### create

▸ **create**(`options?`): `Promise`\<[`EVMts`](evmts_vm.EVMts.md)\>

Creates a [EVMts](evmts_vm.EVMts.md) instance

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`CreateEVMOptions`](../modules/evmts_vm.md#createevmoptions) |

#### Returns

`Promise`\<[`EVMts`](evmts_vm.EVMts.md)\>

#### Defined in

[evmts.ts:85](https://github.com/evmts/evmts-monorepo/blob/main/packages/vm/src/evmts.ts#L85)
