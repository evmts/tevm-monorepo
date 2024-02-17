[@tevm/bench](README.md) / Exports

# @tevm/bench

## Table of contents

### Functions

- [lotsOfMemoryAccess](modules.md#lotsofmemoryaccess)

## Functions

### lotsOfMemoryAccess

▸ **lotsOfMemoryAccess**(`rpcUrl`, `ids?`): `Promise`\<`ContractResult`\<(\{ `anonymous?`: `undefined` = false; `inputs`: `never`[] = []; `name?`: `undefined` = 'balanceOf'; `outputs?`: `undefined` ; `stateMutability`: `string` = 'nonpayable'; `type`: `string` = 'constructor' } \| \{ `anonymous?`: `undefined` = false; `inputs`: `never`[] = []; `name`: `string` = 'AccountBalanceOverflow'; `outputs?`: `undefined` ; `stateMutability?`: `undefined` = 'view'; `type`: `string` = 'error' } \| \{ `anonymous`: `boolean` = false; `inputs`: \{ `indexed`: `boolean` = true; `internalType`: `string` = 'address'; `name`: `string` = 'owner'; `type`: `string` = 'address' }[] ; `name`: `string` = 'ApprovalForAll'; `outputs?`: `undefined` ; `stateMutability?`: `undefined` = 'view'; `type`: `string` = 'event' } \| \{ `anonymous?`: `undefined` = false; `inputs`: \{ `internalType`: `string` = 'address'; `name`: `string` = 'owner'; `type`: `string` = 'address' }[] ; `name`: `string` = 'balanceOf'; `outputs`: \{ `internalType`: `string` = 'uint256'; `name`: `string` = 'result'; `type`: `string` = 'uint256' }[] ; `stateMutability`: `string` = 'view'; `type`: `string` = 'function' })[], ``"batchMint"``\>\>

initialize a brand new tevm client and then execute a call with lots of storage requirements. This is similar to how one might use tevm in a serverless function where tevm is reinitialized often

#### Parameters

| Name | Type |
| :------ | :------ |
| `rpcUrl` | `string` |
| `ids` | `number`[] |

#### Returns

`Promise`\<`ContractResult`\<(\{ `anonymous?`: `undefined` = false; `inputs`: `never`[] = []; `name?`: `undefined` = 'balanceOf'; `outputs?`: `undefined` ; `stateMutability`: `string` = 'nonpayable'; `type`: `string` = 'constructor' } \| \{ `anonymous?`: `undefined` = false; `inputs`: `never`[] = []; `name`: `string` = 'AccountBalanceOverflow'; `outputs?`: `undefined` ; `stateMutability?`: `undefined` = 'view'; `type`: `string` = 'error' } \| \{ `anonymous`: `boolean` = false; `inputs`: \{ `indexed`: `boolean` = true; `internalType`: `string` = 'address'; `name`: `string` = 'owner'; `type`: `string` = 'address' }[] ; `name`: `string` = 'ApprovalForAll'; `outputs?`: `undefined` ; `stateMutability?`: `undefined` = 'view'; `type`: `string` = 'event' } \| \{ `anonymous?`: `undefined` = false; `inputs`: \{ `internalType`: `string` = 'address'; `name`: `string` = 'owner'; `type`: `string` = 'address' }[] ; `name`: `string` = 'balanceOf'; `outputs`: \{ `internalType`: `string` = 'uint256'; `name`: `string` = 'result'; `type`: `string` = 'uint256' }[] ; `stateMutability`: `string` = 'view'; `type`: `string` = 'function' })[], ``"batchMint"``\>\>

#### Defined in

[lotsOfMemoryAccess/lotsOfMemoryAccess.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/test/bench/src/lotsOfMemoryAccess/lotsOfMemoryAccess.ts#L10)
