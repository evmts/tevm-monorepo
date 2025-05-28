[**@tevm/common**](../README.md)

***

[@tevm/common](../globals.md) / MockKzg

# Type Alias: MockKzg

> **MockKzg** = `object`

Defined in: [packages/common/src/MockKzg.ts:24](https://github.com/evmts/tevm-monorepo/blob/main/packages/common/src/MockKzg.ts#L24)

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

> **blobToKzgCommitment**: (`blob`) => `string`

Defined in: [packages/common/src/MockKzg.ts:27](https://github.com/evmts/tevm-monorepo/blob/main/packages/common/src/MockKzg.ts#L27)

#### Parameters

##### blob

`string`

#### Returns

`string`

***

### computeBlobKzgProof()

> **computeBlobKzgProof**: (`blob`, `commitment`) => `string`

Defined in: [packages/common/src/MockKzg.ts:28](https://github.com/evmts/tevm-monorepo/blob/main/packages/common/src/MockKzg.ts#L28)

#### Parameters

##### blob

`string`

##### commitment

`string`

#### Returns

`string`

***

### computeBlobProof()

> **computeBlobProof**: (`blob`, `commitment`) => `string`

Defined in: [packages/common/src/MockKzg.ts:33](https://github.com/evmts/tevm-monorepo/blob/main/packages/common/src/MockKzg.ts#L33)

#### Parameters

##### blob

`string`

##### commitment

`string`

#### Returns

`string`

***

### freeTrustedSetup()

> **freeTrustedSetup**: () => `void`

Defined in: [packages/common/src/MockKzg.ts:26](https://github.com/evmts/tevm-monorepo/blob/main/packages/common/src/MockKzg.ts#L26)

#### Returns

`void`

***

### loadTrustedSetup()

> **loadTrustedSetup**: (`trustedSetup?`) => `number`

Defined in: [packages/common/src/MockKzg.ts:25](https://github.com/evmts/tevm-monorepo/blob/main/packages/common/src/MockKzg.ts#L25)

#### Parameters

##### trustedSetup?

`any`

#### Returns

`number`

***

### verifyBlobKzgProof()

> **verifyBlobKzgProof**: (`blob`, `commitment`, `proof`) => `boolean`

Defined in: [packages/common/src/MockKzg.ts:31](https://github.com/evmts/tevm-monorepo/blob/main/packages/common/src/MockKzg.ts#L31)

#### Parameters

##### blob

`string`

##### commitment

`string`

##### proof

`string`

#### Returns

`boolean`

***

### verifyBlobKzgProofBatch()

> **verifyBlobKzgProofBatch**: (`blobs`, `commitments`, `proofs`) => `boolean`

Defined in: [packages/common/src/MockKzg.ts:29](https://github.com/evmts/tevm-monorepo/blob/main/packages/common/src/MockKzg.ts#L29)

#### Parameters

##### blobs

`string`[]

##### commitments

`string`[]

##### proofs

`string`[]

#### Returns

`boolean`

***

### verifyBlobProofBatch()

> **verifyBlobProofBatch**: (`blobs`, `commitments`, `proofs`) => `boolean`

Defined in: [packages/common/src/MockKzg.ts:35](https://github.com/evmts/tevm-monorepo/blob/main/packages/common/src/MockKzg.ts#L35)

#### Parameters

##### blobs

`string`[]

##### commitments

`string`[]

##### proofs

`string`[]

#### Returns

`boolean`

***

### verifyKzgProof()

> **verifyKzgProof**: (`commitment`, `z`, `y`, `proof`) => `boolean`

Defined in: [packages/common/src/MockKzg.ts:30](https://github.com/evmts/tevm-monorepo/blob/main/packages/common/src/MockKzg.ts#L30)

#### Parameters

##### commitment

`string`

##### z

`string`

##### y

`string`

##### proof

`string`

#### Returns

`boolean`

***

### verifyProof()

> **verifyProof**: (`commitment`, `z`, `y`, `proof`) => `boolean`

Defined in: [packages/common/src/MockKzg.ts:34](https://github.com/evmts/tevm-monorepo/blob/main/packages/common/src/MockKzg.ts#L34)

#### Parameters

##### commitment

`string`

##### z

`string`

##### y

`string`

##### proof

`string`

#### Returns

`boolean`
