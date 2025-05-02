[**@tevm/primitives**](../../../README.md)

***

[@tevm/primitives](../../../globals.md) / [Bloom](../README.md) / containsLog

# Function: containsLog()

> **containsLog**(`bloom`, `address`, `topics`): `Effect`\<`boolean`, `Error`\>

Defined in: [Bloom.ts:268](https://github.com/evmts/tevm-monorepo/blob/main/packages/primitives/src/Bloom.ts#L268)

Checks if a bloom filter might contain a log entry

## Parameters

### bloom

[`Bloom`](../type-aliases/Bloom.md)

The bloom filter.

### address

[`Address`](../../Address/type-aliases/Address.md)

The log address.

### topics

[`B256`](../../B256/type-aliases/B256.md)[]

The log topics.

## Returns

`Effect`\<`boolean`, `Error`\>
