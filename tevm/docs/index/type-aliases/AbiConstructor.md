**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [index](../README.md) > AbiConstructor

# Type alias: AbiConstructor

> **AbiConstructor**: `object`

ABI ["constructor"](https://docs.soliditylang.org/en/latest/abi-spec.html#json) type

## Type declaration

### inputs

> **inputs**: readonly `AbiParameter`[]

### payable

> **payable**?: `boolean`

#### Deprecated

use `payable` or `nonpayable` from [AbiStateMutability]([object Object]) instead

#### See

https://github.com/ethereum/solidity/issues/992

### stateMutability

> **stateMutability**: `Extract`\<`AbiStateMutability`, `"payable"` \| `"nonpayable"`\>

### type

> **type**: `"constructor"`

## Source

node\_modules/.pnpm/abitype@1.0.2\_typescript@5.4.5\_zod@3.22.5/node\_modules/abitype/dist/types/abi.d.ts:74

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
