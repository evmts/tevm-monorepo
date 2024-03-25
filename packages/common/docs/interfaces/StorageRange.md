[@tevm/common](../README.md) / [Exports](../modules.md) / StorageRange

# Interface: StorageRange

Object that can contain a set of storage keys associated with an account.

## Table of contents

### Properties

- [nextKey](StorageRange.md#nextkey)
- [storage](StorageRange.md#storage)

## Properties

### nextKey

• **nextKey**: ``null`` \| `string`

The next (hashed) storage key after the greatest storage key
contained in `storage`.

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:28

___

### storage

• **storage**: `Object`

A dictionary where the keys are hashed storage keys, and the values are
objects containing the preimage of the hashed key (in `key`) and the
storage key (in `value`). Currently, there is no way to retrieve preimages,
so they are always `null`.

#### Index signature

▪ [key: `string`]: \{ `key`: `string` \| ``null`` ; `value`: `string`  }

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:18
