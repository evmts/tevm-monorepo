[**@tevm/common**](../README.md)

***

[@tevm/common](../globals.md) / StorageRange

# Interface: StorageRange

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:11

Object that can contain a set of storage keys associated with an account.

## Properties

### nextKey

> **nextKey**: `string` \| `null`

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:28

The next (hashed) storage key after the greatest storage key
contained in `storage`.

***

### storage

> **storage**: `object`

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:18

A dictionary where the keys are hashed storage keys, and the values are
objects containing the preimage of the hashed key (in `key`) and the
storage key (in `value`). Currently, there is no way to retrieve preimages,
so they are always `null`.

#### Index Signature

\[`key`: `string`\]: `object`
