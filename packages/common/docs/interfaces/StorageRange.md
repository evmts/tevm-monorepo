**@tevm/common** • [Readme](../README.md) \| [API](../globals.md)

***

[@tevm/common](../README.md) / StorageRange

# Interface: StorageRange

Object that can contain a set of storage keys associated with an account.

## Properties

### nextKey

> **nextKey**: `null` \| `string`

The next (hashed) storage key after the greatest storage key
contained in `storage`.

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:28

***

### storage

> **storage**: `object`

A dictionary where the keys are hashed storage keys, and the values are
objects containing the preimage of the hashed key (in `key`) and the
storage key (in `value`). Currently, there is no way to retrieve preimages,
so they are always `null`.

#### Index signature

 \[`key`: `string`\]: `object`

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:18
