[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / GetAccountResult

# Type Alias: GetAccountResult\<ErrorType\>

> **GetAccountResult**\<`ErrorType`\> = `object`

Result of GetAccount Action

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `ErrorType` | [`TevmGetAccountError`](TevmGetAccountError.md) |

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="address"></a> `address` | [`Address`](Address.md) | Address of account |
| <a id="balance"></a> `balance` | `bigint` | Balance to set account to |
| <a id="codehash"></a> `codeHash` | [`Hex`](Hex.md) | Code hash to set account to |
| <a id="deployedbytecode"></a> `deployedBytecode` | [`Hex`](Hex.md) | Contract bytecode to set account to |
| <a id="errors"></a> `errors?` | `ErrorType`[] | Description of the exception, if any occurred |
| <a id="iscontract"></a> `isContract` | `boolean` | True if account is a contract |
| <a id="isempty"></a> `isEmpty` | `boolean` | True if account is empty |
| <a id="nonce"></a> `nonce` | `bigint` | Nonce to set account to |
| <a id="storage"></a> `storage?` | `object` | Contract storage for the account only included if `returnStorage` is set to true in the request |
| <a id="storageroot"></a> `storageRoot` | [`Hex`](Hex.md) | Storage root to set account to |
