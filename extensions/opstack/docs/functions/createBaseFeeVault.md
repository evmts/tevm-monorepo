[**@tevm/opstack**](../README.md) • **Docs**

***

[@tevm/opstack](../globals.md) / createBaseFeeVault

# Function: createBaseFeeVault()

> **createBaseFeeVault**(`chainId`): `Omit`\<`Script`\<`"BaseFeeVault"`, readonly [`"constructor(address _recipient, uint256 _minWithdrawalAmount, uint8 _withdrawalNetwork)"`, `"receive() external payable"`, `"function MIN_WITHDRAWAL_AMOUNT() view returns (uint256)"`, `"function RECIPIENT() view returns (address)"`, `"function WITHDRAWAL_NETWORK() view returns (uint8)"`, `"function totalProcessed() view returns (uint256)"`, `"function version() view returns (string)"`, `"function withdraw()"`, `"event Withdrawal(uint256 value, address to, address from)"`, `"event Withdrawal(uint256 value, address to, address from, uint8 withdrawalNetwork)"`]\>, `"address"` \| `"events"` \| `"read"` \| `"write"`\> & `object`

Creates a BaseFeeVault contract instance from a chainId
Currently only supports chainId 10

## Parameters

• **chainId**: `10`= `10`

## Returns

`Omit`\<`Script`\<`"BaseFeeVault"`, readonly [`"constructor(address _recipient, uint256 _minWithdrawalAmount, uint8 _withdrawalNetwork)"`, `"receive() external payable"`, `"function MIN_WITHDRAWAL_AMOUNT() view returns (uint256)"`, `"function RECIPIENT() view returns (address)"`, `"function WITHDRAWAL_NETWORK() view returns (uint8)"`, `"function totalProcessed() view returns (uint256)"`, `"function version() view returns (string)"`, `"function withdraw()"`, `"event Withdrawal(uint256 value, address to, address from)"`, `"event Withdrawal(uint256 value, address to, address from, uint8 withdrawalNetwork)"`]\>, `"address"` \| `"events"` \| `"read"` \| `"write"`\> & `object`

## Example

```ts
import { createBaseFeeVault } from '@tevm/opstack'
const BaseFeeVault = createBaseFeeVault()
```

## Source

[extensions/opstack/src/contracts/l2/BaseFeeVault.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/extensions/opstack/src/contracts/l2/BaseFeeVault.ts#L13)
