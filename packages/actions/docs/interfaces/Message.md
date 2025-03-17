[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / Message

# Interface: Message

Defined in: [packages/actions/src/common/CallEvents.ts:18](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/CallEvents.ts#L18)

Message object representing a call to the EVM
This corresponds to the EVM's internal Message object

## Properties

### authcallOrigin?

> `optional` **authcallOrigin**: `Address`

Defined in: [packages/actions/src/common/CallEvents.ts:42](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/CallEvents.ts#L42)

Origin address for AUTH calls

***

### caller

> **caller**: `Address`

Defined in: [packages/actions/src/common/CallEvents.ts:24](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/CallEvents.ts#L24)

Address of the account that initiated this call

***

### code?

> `optional` **code**: `any`

Defined in: [packages/actions/src/common/CallEvents.ts:30](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/CallEvents.ts#L30)

Contract code for the call - can be bytecode or a precompile function

***

### data

> **data**: `Uint8Array`

Defined in: [packages/actions/src/common/CallEvents.ts:28](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/CallEvents.ts#L28)

Input data to the call

***

### delegatecall

> **delegatecall**: `boolean`

Defined in: [packages/actions/src/common/CallEvents.ts:38](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/CallEvents.ts#L38)

Whether this is a DELEGATECALL

***

### depth

> **depth**: `number`

Defined in: [packages/actions/src/common/CallEvents.ts:32](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/CallEvents.ts#L32)

Call depth

***

### gasLimit

> **gasLimit**: `bigint`

Defined in: [packages/actions/src/common/CallEvents.ts:26](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/CallEvents.ts#L26)

Gas limit for this call

***

### gasRefund?

> `optional` **gasRefund**: `bigint`

Defined in: [packages/actions/src/common/CallEvents.ts:44](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/CallEvents.ts#L44)

Gas refund counter

***

### isCompiled

> **isCompiled**: `boolean`

Defined in: [packages/actions/src/common/CallEvents.ts:36](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/CallEvents.ts#L36)

Whether this is precompiled contract code

***

### isStatic

> **isStatic**: `boolean`

Defined in: [packages/actions/src/common/CallEvents.ts:34](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/CallEvents.ts#L34)

Whether the call is static (view)

***

### salt?

> `optional` **salt**: `Uint8Array`

Defined in: [packages/actions/src/common/CallEvents.ts:40](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/CallEvents.ts#L40)

Salt for CREATE2 calls

***

### to?

> `optional` **to**: `Address`

Defined in: [packages/actions/src/common/CallEvents.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/CallEvents.ts#L20)

Target address (undefined for contract creation)

***

### value

> **value**: `bigint`

Defined in: [packages/actions/src/common/CallEvents.ts:22](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/CallEvents.ts#L22)

Value sent with the call (in wei)
