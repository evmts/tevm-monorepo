[@tevm/vm](../README.md) / [Exports](../modules.md) / Tevm

# Class: Tevm

A local EVM instance running in JavaScript. Similar to Anvil in your browser

**`Example`**

```ts
import { Tevm } from "tevm"
import { createPublicClient, http } from "viem"
import { MyERC721 } from './MyERC721.sol'

const tevm = Tevm.create({
	fork: {
	  url: "https://mainnet.optimism.io",
	},
})

const address = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',

await tevm.runContractCall(
  MyERC721.write.mint({
    caller: address,
  }),
)

const balance = await tevm.runContractCall(
 MyERC721.read.balanceOf({
 caller: address,
 }),
 )
 console.log(balance) // 1n
 ```

## Table of contents

### Constructors

- [constructor](Tevm.md#constructor)

### Properties

- [\_evm](Tevm.md#_evm)
- [isCreating](Tevm.md#iscreating)

### Methods

- [putAccount](Tevm.md#putaccount)
- [putContractCode](Tevm.md#putcontractcode)
- [runCall](Tevm.md#runcall)
- [runContractCall](Tevm.md#runcontractcall)
- [runScript](Tevm.md#runscript)
- [create](Tevm.md#create)

## Constructors

### constructor

• **new Tevm**(`_evm`): [`Tevm`](Tevm.md)

A local EVM instance running in JavaScript. Similar to Anvil in your browser

#### Parameters

| Name | Type |
| :------ | :------ |
| `_evm` | `EVM` |

#### Returns

[`Tevm`](Tevm.md)

#### Defined in

[vm/vm/src/tevm.ts:149](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/tevm.ts#L149)

## Properties

### \_evm

• `Readonly` **\_evm**: `EVM`

#### Defined in

[vm/vm/src/tevm.ts:149](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/tevm.ts#L149)

___

### isCreating

▪ `Static` `Private` **isCreating**: `boolean` = `false`

Makes sure tevm is invoked with Tevm.create and not with new Tevm

#### Defined in

[vm/vm/src/tevm.ts:103](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/tevm.ts#L103)

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
tevm.putAccount({
	address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
	balance: 100n,
})
```

#### Defined in

[vm/vm/src/tevm.ts:197](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/tevm.ts#L197)

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
tevm.putContract({
 bytecode,
 contractAddress,
})
```

#### Defined in

[vm/vm/src/tevm.ts:211](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/tevm.ts#L211)

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
const result = await tevm.runCall({
  data: '0x...',
  caller: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
  gasLimit: 1000000n,
  value: 10000000000000000n,
})
```

#### Defined in

[vm/vm/src/tevm.ts:227](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/tevm.ts#L227)

___

### runContractCall

▸ **runContractCall**\<`TAbi`, `TFunctionName`\>(`action`): `Promise`\<[`RunContractCallResult`](../modules.md#runcontractcallresult)\<`TAbi`, `TFunctionName`\>\>

Calls contract code using an ABI and returns the decoded result

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends readonly `unknown`[] \| `Abi` = `Abi` |
| `TFunctionName` | extends `string` = `string` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `action` | [`RunContractCallAction`](../modules.md#runcontractcallaction)\<`TAbi`, `TFunctionName`\> |

#### Returns

`Promise`\<[`RunContractCallResult`](../modules.md#runcontractcallresult)\<`TAbi`, `TFunctionName`\>\>

**`Example`**

```ts
const result = await tevm.runContractCall({
 abi: MyContract.abi,
 contractAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
 functionName: 'balanceOf',
 args: ['0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'],
})
```

#### Defined in

[vm/vm/src/tevm.ts:243](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/tevm.ts#L243)

___

### runScript

▸ **runScript**\<`TAbi`, `TFunctionName`\>(`action`): `Promise`\<[`RunScriptResult`](../modules.md#runscriptresult)\<`TAbi`, `TFunctionName`\>\>

Runs a script or contract that is not deployed to the chain
The recomended way to use a script is with an Tevm import

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends readonly `unknown`[] \| `Abi` = `Abi` |
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
  tevm: 'bytecode'
}
tevm.runScript(
  MyContractOrScript.script.run()
)
```
Scripts can also be called directly via passing in args

**`Example`**

```ts
tevm.runScript({
  bytecode,
  abi,
  functionName: 'run',
})
```

#### Defined in

[vm/vm/src/tevm.ts:178](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/tevm.ts#L178)

___

### create

▸ **create**(`options?`): `Promise`\<[`Tevm`](Tevm.md)\>

Creates a [Tevm](Tevm.md) instance

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`CreateEVMOptions`](../modules.md#createevmoptions) |

#### Returns

`Promise`\<[`Tevm`](Tevm.md)\>

#### Defined in

[vm/vm/src/tevm.ts:108](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/tevm.ts#L108)
