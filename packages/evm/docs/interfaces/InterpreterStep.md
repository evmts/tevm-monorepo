[**@tevm/evm**](../README.md)

***

[@tevm/evm](../globals.md) / InterpreterStep

# Interface: InterpreterStep

## Properties

### account

> **account**: `Account`

***

### address

> **address**: `Address`

***

### codeAddress

> **codeAddress**: `Address`

***

### depth

> **depth**: `number`

***

### eofFunctionDepth?

> `optional` **eofFunctionDepth?**: `number`

***

### eofSection?

> `optional` **eofSection?**: `number`

***

### error?

> `optional` **error?**: `Uint8Array`\<`ArrayBufferLike`\>

***

### gasLeft

> **gasLeft**: `bigint`

***

### gasRefund

> **gasRefund**: `bigint`

***

### immediate?

> `optional` **immediate?**: `Uint8Array`\<`ArrayBufferLike`\>

***

### memory

> **memory**: `Uint8Array`

***

### memoryWordCount

> **memoryWordCount**: `bigint`

***

### opcode

> **opcode**: `object`

#### code

> **code**: `number`

#### dynamicFee?

> `optional` **dynamicFee?**: `bigint`

#### fee

> **fee**: `number`

#### isAsync

> **isAsync**: `boolean`

#### name

> **name**: `string`

***

### pc

> **pc**: `number`

***

### stack

> **stack**: `bigint`[]

***

### stateManager

> **stateManager**: `StateManagerInterface`

***

### storage?

> `optional` **storage?**: \[`` `0x${string}` ``, `` `0x${string}` ``\][]
