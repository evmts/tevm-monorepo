[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / MockKzg

# Type Alias: MockKzg

> **MockKzg** = `object`

Defined in: packages/common/types/MockKzg.d.ts:21

The interface of the custom crypto for kzg implemented by `createMockKzg``
The real kzg commitmenet is over 500kb added to bundle size
so this is useful alternative for smaller bundles and the default

## Example

```typescript
import { createCommon, createMockKzg, mainnet, type MockKzg } from 'tevm/common'

const kzg: MockKzg = createMockKzg()

const common = createCommon({
  ...mainnet,
  customCrypto: {
    kzg:,
  },
})
```

## See

 - [createMockKzg](https://tevm.sh/reference/tevm/common/functions/createmockkzg/)
 - [createCommon](https://tevm.sh/reference/tevm/common/functions/createcommon/)

## Properties

### blobToKzgCommitment()

> **blobToKzgCommitment**: (`blob`) => `Uint8Array`

Defined in: packages/common/types/MockKzg.d.ts:24

#### Parameters

##### blob

`Uint8Array`

#### Returns

`Uint8Array`

***

### computeBlobKzgProof()

> **computeBlobKzgProof**: (`blob`, `commitment`) => `Uint8Array`

Defined in: packages/common/types/MockKzg.d.ts:25

#### Parameters

##### blob

`Uint8Array`

##### commitment

`Uint8Array`

#### Returns

`Uint8Array`

***

### freeTrustedSetup()

> **freeTrustedSetup**: () => `void`

Defined in: packages/common/types/MockKzg.d.ts:23

#### Returns

`void`

***

### loadTrustedSetup()

> **loadTrustedSetup**: (`trustedSetup`?) => `number`

Defined in: packages/common/types/MockKzg.d.ts:22

#### Parameters

##### trustedSetup?

`any`

#### Returns

`number`

***

### verifyBlobKzgProof()

> **verifyBlobKzgProof**: (`blob`, `commitment`, `proof`) => `boolean`

Defined in: packages/common/types/MockKzg.d.ts:28

#### Parameters

##### blob

`Uint8Array`

##### commitment

`Uint8Array`

##### proof

`Uint8Array`

#### Returns

`boolean`

***

### verifyBlobKzgProofBatch()

> **verifyBlobKzgProofBatch**: (`blobs`, `commitments`, `proofs`) => `boolean`

Defined in: packages/common/types/MockKzg.d.ts:26

#### Parameters

##### blobs

`Uint8Array`[]

##### commitments

`Uint8Array`[]

##### proofs

`Uint8Array`[]

#### Returns

`boolean`

***

### verifyKzgProof()

> **verifyKzgProof**: (`commitment`, `z`, `y`, `proof`) => `boolean`

Defined in: packages/common/types/MockKzg.d.ts:27

#### Parameters

##### commitment

`Uint8Array`

##### z

`Uint8Array`

##### y

`Uint8Array`

##### proof

`Uint8Array`

#### Returns

`boolean`
