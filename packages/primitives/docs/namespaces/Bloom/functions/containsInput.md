[**@tevm/primitives**](../../../README.md)

***

[@tevm/primitives](../../../globals.md) / [Bloom](../README.md) / containsInput

# Function: containsInput()

> **containsInput**(`bloom`, `input`, `inputType`): `Effect`\<`boolean`, `Error`\>

Defined in: [Bloom.ts:187](https://github.com/evmts/tevm-monorepo/blob/main/packages/primitives/src/Bloom.ts#L187)

Checks if a bloom filter might contain an item

## Parameters

### bloom

[`Bloom`](../type-aliases/Bloom.md)

The bloom filter.

### input

`Uint8Array`

The input bytes to check.

### inputType

[`BloomInputType`](../enumerations/BloomInputType.md) = `BloomInputType.Raw`

Whether the input is raw or already hashed.

## Returns

`Effect`\<`boolean`, `Error`\>
