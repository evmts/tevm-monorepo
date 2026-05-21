[**@tevm/tx**](../README.md)

***

[@tevm/tx](../globals.md) / JsonTx

# Interface: JsonTx

Generic interface for all tx types with a
JSON representation of a transaction.

Note that all values are marked as optional
and not all the values are present on all tx types
(an EIP1559 tx e.g. lacks a `gasPrice`).

## Properties

### accessList?

> `optional` **accessList?**: `JSONAccessListItem`[]

***

### authorizationList?

> `optional` **authorizationList?**: `EOACode7702AuthorizationList`

***

### blobVersionedHashes?

> `optional` **blobVersionedHashes?**: `` `0x${string}` ``[]

***

### chainId?

> `optional` **chainId?**: `` `0x${string}` ``

***

### data?

> `optional` **data?**: `` `0x${string}` ``

***

### gasLimit?

> `optional` **gasLimit?**: `` `0x${string}` ``

***

### gasPrice?

> `optional` **gasPrice?**: `` `0x${string}` ``

***

### maxFeePerBlobGas?

> `optional` **maxFeePerBlobGas?**: `` `0x${string}` ``

***

### maxFeePerGas?

> `optional` **maxFeePerGas?**: `` `0x${string}` ``

***

### maxPriorityFeePerGas?

> `optional` **maxPriorityFeePerGas?**: `` `0x${string}` ``

***

### nonce?

> `optional` **nonce?**: `` `0x${string}` ``

***

### r?

> `optional` **r?**: `` `0x${string}` ``

***

### s?

> `optional` **s?**: `` `0x${string}` ``

***

### to?

> `optional` **to?**: `` `0x${string}` ``

***

### type?

> `optional` **type?**: `` `0x${string}` ``

***

### v?

> `optional` **v?**: `` `0x${string}` ``

***

### value?

> `optional` **value?**: `` `0x${string}` ``

***

### yParity?

> `optional` **yParity?**: `` `0x${string}` ``
