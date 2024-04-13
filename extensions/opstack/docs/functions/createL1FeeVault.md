**@tevm/opstack** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > createL1FeeVault

# Function: createL1FeeVault()

> **createL1FeeVault**(`chainId`): `Omit`\<`Script`\<`"L1FeeVault"`, readonly [`"constructor(address _recipient, uint256 _minWithdrawalAmount, uint8 _withdrawalNetwork)"`, `"receive() external payable"`, `"function MIN_WITHDRAWAL_AMOUNT() view returns (uint256)"`, `"function RECIPIENT() view returns (address)"`, `"function WITHDRAWAL_NETWORK() view returns (uint8)"`, `"function totalProcessed() view returns (uint256)"`, `"function version() view returns (string)"`, `"function withdraw()"`, `"event Withdrawal(uint256 value, address to, address from)"`, `"event Withdrawal(uint256 value, address to, address from, uint8 withdrawalNetwork)"`]\>, `"address"` \| `"events"` \| `"read"` \| `"write"`\> & `object`

Creates a L1FeeVault contract instance from a chainId
Currently only supports chainId 10

## Parameters

▪ **chainId**: `10`= `10`

## Returns

## Example

```ts
import { createL1FeeVault } from '@tevm/opstack'
const L1FeeVault = createL1FeeVault()
```

## Source

[extensions/opstack/src/contracts/l2/L1FeeVault.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/extensions/opstack/src/contracts/l2/L1FeeVault.ts#L13)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
