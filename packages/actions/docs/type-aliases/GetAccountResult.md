[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / GetAccountResult

# Type Alias: GetAccountResult\<ErrorType\>

> **GetAccountResult**\<`ErrorType`\> = `object`

Defined in: [packages/actions/src/GetAccount/GetAccountResult.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/GetAccount/GetAccountResult.ts#L7)

Result of GetAccount Action

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `ErrorType` | [`TevmGetAccountError`](TevmGetAccountError.md) |

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="address"></a> `address` | [`Address`](Address.md) | Address of account | [packages/actions/src/GetAccount/GetAccountResult.ts:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/GetAccount/GetAccountResult.ts#L15) |
| <a id="balance"></a> `balance` | `bigint` | Balance to set account to | [packages/actions/src/GetAccount/GetAccountResult.ts:23](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/GetAccount/GetAccountResult.ts#L23) |
| <a id="codehash"></a> `codeHash` | [`Hex`](Hex.md) | Code hash to set account to | [packages/actions/src/GetAccount/GetAccountResult.ts:35](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/GetAccount/GetAccountResult.ts#L35) |
| <a id="deployedbytecode"></a> `deployedBytecode` | [`Hex`](Hex.md) | Contract bytecode to set account to | [packages/actions/src/GetAccount/GetAccountResult.ts:27](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/GetAccount/GetAccountResult.ts#L27) |
| <a id="errors"></a> `errors?` | `ErrorType`[] | Description of the exception, if any occurred | [packages/actions/src/GetAccount/GetAccountResult.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/GetAccount/GetAccountResult.ts#L11) |
| <a id="iscontract"></a> `isContract` | `boolean` | True if account is a contract | [packages/actions/src/GetAccount/GetAccountResult.ts:39](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/GetAccount/GetAccountResult.ts#L39) |
| <a id="isempty"></a> `isEmpty` | `boolean` | True if account is empty | [packages/actions/src/GetAccount/GetAccountResult.ts:43](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/GetAccount/GetAccountResult.ts#L43) |
| <a id="nonce"></a> `nonce` | `bigint` | Nonce to set account to | [packages/actions/src/GetAccount/GetAccountResult.ts:19](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/GetAccount/GetAccountResult.ts#L19) |
| <a id="storage"></a> `storage?` | `object` | Contract storage for the account only included if `returnStorage` is set to true in the request | [packages/actions/src/GetAccount/GetAccountResult.ts:48](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/GetAccount/GetAccountResult.ts#L48) |
| <a id="storageroot"></a> `storageRoot` | [`Hex`](Hex.md) | Storage root to set account to | [packages/actions/src/GetAccount/GetAccountResult.ts:31](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/GetAccount/GetAccountResult.ts#L31) |
