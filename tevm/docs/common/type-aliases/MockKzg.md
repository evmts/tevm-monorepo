[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / MockKzg

# Type Alias: MockKzg

> **MockKzg** = `object`

The interface of the custom crypto for KZG implemented by `createMockKzg`.
The real KZG commitment implementation can add significant bundle size,
so this is a useful explicit opt-in alternative for smaller bundles.

## Example

```typescript
import { createCommon, createMockKzg, mainnet, type MockKzg } from 'tevm/common'

const kzg: MockKzg = createMockKzg()

const common = createCommon({
  ...mainnet,
  customCrypto: {
    kzg,
  },
})
```

## See

 - [createMockKzg](https://tevm.sh/reference/tevm/common/functions/createmockkzg/)
 - [createCommon](https://tevm.sh/reference/tevm/common/functions/createcommon/)

## Properties

| Property | Type |
| ------ | ------ |
| <a id="blobtokzgcommitment"></a> `blobToKzgCommitment` | (`blob`) => `string` |
| <a id="computeblobkzgproof"></a> `computeBlobKzgProof` | (`blob`, `commitment`) => `string` |
| <a id="computeblobproof"></a> `computeBlobProof` | (`blob`, `commitment`) => `string` |
| <a id="computecells"></a> `computeCells` | (`blob`) => `string`[] |
| <a id="computecellsandproofs"></a> `computeCellsAndProofs` | (`blob`) => \[`string`[], `string`[]\] |
| <a id="freetrustedsetup"></a> `freeTrustedSetup` | () => `void` |
| <a id="loadtrustedsetup"></a> `loadTrustedSetup` | (`trustedSetup?`) => `number` |
| <a id="recovercellsandproofs"></a> `recoverCellsAndProofs` | (`indices`, `cells`) => \[`string`[], `string`[]\] |
| <a id="verifyblobkzgproof"></a> `verifyBlobKzgProof` | (`blob`, `commitment`, `proof`) => `boolean` |
| <a id="verifyblobkzgproofbatch"></a> `verifyBlobKzgProofBatch` | (`blobs`, `commitments`, `proofs`) => `boolean` |
| <a id="verifyblobproofbatch"></a> `verifyBlobProofBatch` | (`blobs`, `commitments`, `proofs`) => `boolean` |
| <a id="verifycellkzgproofbatch"></a> `verifyCellKzgProofBatch` | (`commitments`, `indices`, `cells`, `proofs`) => `boolean` |
| <a id="verifykzgproof"></a> `verifyKzgProof` | (`commitment`, `z`, `y`, `proof`) => `boolean` |
| <a id="verifyproof"></a> `verifyProof` | (`commitment`, `z`, `y`, `proof`) => `boolean` |
