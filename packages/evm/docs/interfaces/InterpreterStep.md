[**@tevm/evm**](../README.md)

***

[@tevm/evm](../globals.md) / InterpreterStep

# Interface: InterpreterStep

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/interpreter.d.ts:78

## Properties

### account

> **account**: `Account`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/interpreter.d.ts:92

***

### address

> **address**: `Address`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/interpreter.d.ts:93

***

### codeAddress

> **codeAddress**: `Address`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/interpreter.d.ts:96

***

### depth

> **depth**: `number`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/interpreter.d.ts:84

***

### eofFunctionDepth?

> `optional` **eofFunctionDepth**: `number`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/interpreter.d.ts:99

***

### eofSection?

> `optional` **eofSection**: `number`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/interpreter.d.ts:97

***

### error?

> `optional` **error**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/interpreter.d.ts:100

***

### gasLeft

> **gasLeft**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/interpreter.d.ts:79

***

### gasRefund

> **gasRefund**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/interpreter.d.ts:80

***

### immediate?

> `optional` **immediate**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/interpreter.d.ts:98

***

### memory

> **memory**: `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/interpreter.d.ts:94

***

### memoryWordCount

> **memoryWordCount**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/interpreter.d.ts:95

***

### opcode

> **opcode**: `object`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/interpreter.d.ts:85

#### code

> **code**: `number`

#### dynamicFee?

> `optional` **dynamicFee**: `bigint`

#### fee

> **fee**: `number`

#### isAsync

> **isAsync**: `boolean`

#### name

> **name**: `string`

***

### pc

> **pc**: `number`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/interpreter.d.ts:83

***

### stack

> **stack**: `bigint`[]

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/interpreter.d.ts:82

***

### stateManager

> **stateManager**: `StateManagerInterface`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/interpreter.d.ts:81

***

### storage?

> `optional` **storage**: \[`` `0x${string}` ``, `` `0x${string}` ``\][]

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/interpreter.d.ts:101
