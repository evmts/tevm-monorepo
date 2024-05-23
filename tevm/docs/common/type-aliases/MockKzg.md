[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / MockKzg

# Type alias: MockKzg

> **MockKzg**: `object`

## Type declaration

### blobToKzgCommitment()

> **blobToKzgCommitment**: (`blob`) => `Uint8Array`

#### Parameters

• **blob**: `Uint8Array`

#### Returns

`Uint8Array`

### computeBlobKzgProof()

> **computeBlobKzgProof**: (`blob`, `commitment`) => `Uint8Array`

#### Parameters

• **blob**: `Uint8Array`

• **commitment**: `Uint8Array`

#### Returns

`Uint8Array`

### freeTrustedSetup()

> **freeTrustedSetup**: () => `void`

#### Returns

`void`

### loadTrustedSetup()

> **loadTrustedSetup**: (`trustedSetup`?) => `number`

#### Parameters

• **trustedSetup?**: `any`

#### Returns

`number`

### verifyBlobKzgProof()

> **verifyBlobKzgProof**: (`blob`, `commitment`, `proof`) => `boolean`

#### Parameters

• **blob**: `Uint8Array`

• **commitment**: `Uint8Array`

• **proof**: `Uint8Array`

#### Returns

`boolean`

### verifyBlobKzgProofBatch()

> **verifyBlobKzgProofBatch**: (`blobs`, `commitments`, `proofs`) => `boolean`

#### Parameters

• **blobs**: `Uint8Array`[]

• **commitments**: `Uint8Array`[]

• **proofs**: `Uint8Array`[]

#### Returns

`boolean`

### verifyKzgProof()

> **verifyKzgProof**: (`commitment`, `z`, `y`, `proof`) => `boolean`

#### Parameters

• **commitment**: `Uint8Array`

• **z**: `Uint8Array`

• **y**: `Uint8Array`

• **proof**: `Uint8Array`

#### Returns

`boolean`

## Source

packages/common/types/MockKzg.d.ts:1
