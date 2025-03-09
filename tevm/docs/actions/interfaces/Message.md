[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / Message

# Interface: Message

Defined in: packages/actions/types/common/CallEvents.d.ts:16

Message object representing a call to the EVM
This corresponds to the EVM's internal Message object

## Properties

### authcallOrigin?

> `optional` **authcallOrigin**: [`Address`](../../address/classes/Address.md)

Defined in: packages/actions/types/common/CallEvents.d.ts:40

Origin address for AUTH calls

***

### caller

> **caller**: [`Address`](../../address/classes/Address.md)

Defined in: packages/actions/types/common/CallEvents.d.ts:22

Address of the account that initiated this call

***

### code?

> `optional` **code**: `any`

Defined in: packages/actions/types/common/CallEvents.d.ts:28

Contract code for the call - can be bytecode or a precompile function

***

### data

> **data**: `Uint8Array`

Defined in: packages/actions/types/common/CallEvents.d.ts:26

Input data to the call

***

### delegatecall

> **delegatecall**: `boolean`

Defined in: packages/actions/types/common/CallEvents.d.ts:36

Whether this is a DELEGATECALL

***

### depth

> **depth**: `number`

Defined in: packages/actions/types/common/CallEvents.d.ts:30

Call depth

***

### gasLimit

> **gasLimit**: `bigint`

Defined in: packages/actions/types/common/CallEvents.d.ts:24

Gas limit for this call

***

### gasRefund?

> `optional` **gasRefund**: `bigint`

Defined in: packages/actions/types/common/CallEvents.d.ts:42

Gas refund counter

***

### isCompiled

> **isCompiled**: `boolean`

Defined in: packages/actions/types/common/CallEvents.d.ts:34

Whether this is precompiled contract code

***

### isStatic

> **isStatic**: `boolean`

Defined in: packages/actions/types/common/CallEvents.d.ts:32

Whether the call is static (view)

***

### salt?

> `optional` **salt**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: packages/actions/types/common/CallEvents.d.ts:38

Salt for CREATE2 calls

***

### to?

> `optional` **to**: [`Address`](../../address/classes/Address.md)

Defined in: packages/actions/types/common/CallEvents.d.ts:18

Target address (undefined for contract creation)

***

### value

> **value**: `bigint`

Defined in: packages/actions/types/common/CallEvents.d.ts:20

Value sent with the call (in wei)
