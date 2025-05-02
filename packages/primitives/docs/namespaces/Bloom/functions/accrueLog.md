[**@tevm/primitives**](../../../README.md)

***

[@tevm/primitives](../../../globals.md) / [Bloom](../README.md) / accrueLog

# Function: accrueLog()

> **accrueLog**(`bloom`, `address`, `topics`): `Effect`\<[`Bloom`](../type-aliases/Bloom.md), `Error`\>

Defined in: [Bloom.ts:247](https://github.com/evmts/tevm-monorepo/blob/main/packages/primitives/src/Bloom.ts#L247)

Adds a log entry to the bloom filter

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

`Effect`\<[`Bloom`](../type-aliases/Bloom.md), `Error`\>
