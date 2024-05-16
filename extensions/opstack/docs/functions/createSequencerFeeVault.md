[**@tevm/opstack**](../README.md) • **Docs**

***

[@tevm/opstack](../globals.md) / createSequencerFeeVault

# Function: createSequencerFeeVault()

> **createSequencerFeeVault**(`chainId`): `Omit`\<`Script`\<`"SequencerFeeVault"`, readonly [`"constructor(address _recipient, uint256 _minWithdrawalAmount, uint8 _withdrawalNetwork)"`, `"receive() external payable"`, `"function MIN_WITHDRAWAL_AMOUNT() view returns (uint256)"`, `"function RECIPIENT() view returns (address)"`, `"function WITHDRAWAL_NETWORK() view returns (uint8)"`, `"function l1FeeWallet() view returns (address)"`, `"function totalProcessed() view returns (uint256)"`, `"function version() view returns (string)"`, `"function withdraw()"`, `"event Withdrawal(uint256 value, address to, address from)"`, `"event Withdrawal(uint256 value, address to, address from, uint8 withdrawalNetwork)"`]\>, `"address"` \| `"events"` \| `"read"` \| `"write"`\> & `object`

Creates a SequencerFeeVault contract instance from a chainId
Currently only supports chainId 10

## Parameters

• **chainId**: `10`= `10`

## Returns

`Omit`\<`Script`\<`"SequencerFeeVault"`, readonly [`"constructor(address _recipient, uint256 _minWithdrawalAmount, uint8 _withdrawalNetwork)"`, `"receive() external payable"`, `"function MIN_WITHDRAWAL_AMOUNT() view returns (uint256)"`, `"function RECIPIENT() view returns (address)"`, `"function WITHDRAWAL_NETWORK() view returns (uint8)"`, `"function l1FeeWallet() view returns (address)"`, `"function totalProcessed() view returns (uint256)"`, `"function version() view returns (string)"`, `"function withdraw()"`, `"event Withdrawal(uint256 value, address to, address from)"`, `"event Withdrawal(uint256 value, address to, address from, uint8 withdrawalNetwork)"`]\>, `"address"` \| `"events"` \| `"read"` \| `"write"`\> & `object`

## Example

```ts
import { createSequencerFeeVault } from '@tevm/opstack'
const SequencerFeeVault = createSequencerFeeVault()
```

## Source

[extensions/opstack/src/contracts/l2/SequencerFeeVault.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/extensions/opstack/src/contracts/l2/SequencerFeeVault.ts#L13)
