[@tevm/vm](README.md) / Exports

# @tevm/vm

## Table of contents

### Classes

- [Tevm](undefined)

### Type Aliases

- [CreateEVMOptions](undefined)
- [PutAccountAction](undefined)
- [PutContractCodeAction](undefined)
- [RunCallAction](undefined)
- [RunContractCallAction](undefined)
- [RunContractCallError](undefined)
- [RunContractCallResult](undefined)
- [RunScriptAction](undefined)
- [RunScriptError](undefined)
- [RunScriptResult](undefined)

### Variables

- [CallActionValidator](undefined)
- [PutAccountActionValidator](undefined)
- [PutContractCodeActionValidator](undefined)
- [RunContractCallActionValidator](undefined)
- [RunScriptActionValidator](undefined)

## Classes

### Tevm

• **Tevm**: Class Tevm

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

#### Defined in

[vm/vm/src/tevm.ts:99](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/tevm.ts#L99)

## Type Aliases

### CreateEVMOptions

Ƭ **CreateEVMOptions**: `Object`

Options for creating an Tevm instance

#### Type declaration

| Name | Type |
| :------ | :------ |
| `customPrecompiles?` | CustomPrecompile[] |
| `fork?` | ForkOptions |

#### Defined in

[vm/vm/src/tevm.ts:41](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/tevm.ts#L41)

___

### PutAccountAction

Ƭ **PutAccountAction**: `Object`

Tevm action to put an account into the vm state

#### Type declaration

| Name | Type |
| :------ | :------ |
| `account` | Address |
| `balance?` | bigint |

#### Defined in

[vm/vm/src/actions/putAccount.ts:25](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/actions/putAccount.ts#L25)

___

### PutContractCodeAction

Ƭ **PutContractCodeAction**: `Object`

Tevm action to put contract code into the vm state

#### Type declaration

| Name | Type |
| :------ | :------ |
| `contractAddress` | Address |
| `deployedBytecode` | Hex |

#### Defined in

[vm/vm/src/actions/putContractCode.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/actions/putContractCode.ts#L16)

___

### RunCallAction

Ƭ **RunCallAction**: `Object`

Tevm action to execute a call on the vm

#### Type declaration

| Name | Type |
| :------ | :------ |
| `caller` | Address |
| `data` | Hex |
| `gasLimit?` | bigint |
| `origin?` | Address |
| `to` | Address |
| `value?` | bigint |

#### Defined in

[vm/vm/src/actions/runCall.ts:31](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/actions/runCall.ts#L31)

___

### RunContractCallAction

Ƭ **RunContractCallAction**: EncodeFunctionDataParameters\<TAbi, TFunctionName\> & Object

Tevm action to execute a call on a contract

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends Abi \| readonly unknown[] = Abi |
| `TFunctionName` | extends string = string |

#### Defined in

[vm/vm/src/actions/runContractCall.ts:38](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/actions/runContractCall.ts#L38)

___

### RunContractCallError

Ƭ **RunContractCallError**: Error

#### Defined in

[vm/vm/src/actions/runContractCall.ts:48](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/actions/runContractCall.ts#L48)

___

### RunContractCallResult

Ƭ **RunContractCallResult**: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends Abi \| readonly unknown[] = Abi |
| `TFunctionName` | extends string = string |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `data` | DecodeFunctionResultReturnType\<TAbi, TFunctionName\> |
| `gasUsed` | BigInt |
| `logs` | Log[] |

#### Defined in

[vm/vm/src/actions/runContractCall.ts:50](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/actions/runContractCall.ts#L50)

___

### RunScriptAction

Ƭ **RunScriptAction**: EncodeFunctionDataParameters\<TAbi, TFunctionName\> & Object

Tevm action to deploy and execute a script or contract

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends Abi \| readonly unknown[] = Abi |
| `TFunctionName` | extends string = string |

#### Defined in

[vm/vm/src/actions/runScript.ts:30](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/actions/runScript.ts#L30)

___

### RunScriptError

Ƭ **RunScriptError**: Error

#### Defined in

[vm/vm/src/actions/runScript.ts:39](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/actions/runScript.ts#L39)

___

### RunScriptResult

Ƭ **RunScriptResult**: RunContractCallResult\<TAbi, TFunctionName\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends Abi \| readonly unknown[] = Abi |
| `TFunctionName` | extends string = string |

#### Defined in

[vm/vm/src/actions/runScript.ts:41](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/actions/runScript.ts#L41)

## Variables

### CallActionValidator

• `Const` **CallActionValidator**: ZodObject\<Object, "strip", ZodTypeAny, Object, Object\>

#### Defined in

[vm/vm/src/actions/runCall.ts:19](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/actions/runCall.ts#L19)

___

### PutAccountActionValidator

• `Const` **PutAccountActionValidator**: ZodObject\<Object, "strip", ZodTypeAny, Object, Object\>

#### Defined in

[vm/vm/src/actions/putAccount.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/actions/putAccount.ts#L13)

___

### PutContractCodeActionValidator

• `Const` **PutContractCodeActionValidator**: ZodObject\<Object, "strip", ZodTypeAny, Object, Object\>

#### Defined in

[vm/vm/src/actions/putContractCode.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/actions/putContractCode.ts#L8)

___

### RunContractCallActionValidator

• `Const` **RunContractCallActionValidator**: ZodObject\<Object, "strip", ZodTypeAny, Object, Object\>

#### Defined in

[vm/vm/src/actions/runContractCall.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/actions/runContractCall.ts#L20)

___

### RunScriptActionValidator

• `Const` **RunScriptActionValidator**: ZodObject\<Object, "strip", ZodTypeAny, Object, Object\>

#### Defined in

[vm/vm/src/actions/runScript.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/actions/runScript.ts#L14)
