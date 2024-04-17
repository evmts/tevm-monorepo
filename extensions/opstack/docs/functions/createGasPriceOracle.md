**@tevm/opstack** • [Readme](../README.md) \| [API](../globals.md)

***

[@tevm/opstack](../README.md) / createGasPriceOracle

# Function: createGasPriceOracle()

> **createGasPriceOracle**(`chainId`): `Omit`\<`Script`\<`"GasPriceOracle"`, readonly [`"function DECIMALS() view returns (uint256)"`, `"function baseFee() view returns (uint256)"`, `"function baseFeeScalar() view returns (uint32)"`, `"function blobBaseFee() view returns (uint256)"`, `"function blobBaseFeeScalar() view returns (uint32)"`, `"function decimals() pure returns (uint256)"`, `"function gasPrice() view returns (uint256)"`, `"function getL1Fee(bytes _data) view returns (uint256)"`, `"function getL1GasUsed(bytes _data) view returns (uint256)"`, `"function isEcotone() view returns (bool)"`, `"function l1BaseFee() view returns (uint256)"`, `"function overhead() view returns (uint256)"`, `"function scalar() view returns (uint256)"`, `"function setEcotone()"`, `"function version() view returns (string)"`]\>, `"address"` \| `"events"` \| `"read"` \| `"write"`\> & `object`

Creates a GasPriceOracle contract instance from a chainId
Currently only supports chainId 10

## Parameters

• **chainId**: `10`= `10`

## Returns

`Omit`\<`Script`\<`"GasPriceOracle"`, readonly [`"function DECIMALS() view returns (uint256)"`, `"function baseFee() view returns (uint256)"`, `"function baseFeeScalar() view returns (uint32)"`, `"function blobBaseFee() view returns (uint256)"`, `"function blobBaseFeeScalar() view returns (uint32)"`, `"function decimals() pure returns (uint256)"`, `"function gasPrice() view returns (uint256)"`, `"function getL1Fee(bytes _data) view returns (uint256)"`, `"function getL1GasUsed(bytes _data) view returns (uint256)"`, `"function isEcotone() view returns (bool)"`, `"function l1BaseFee() view returns (uint256)"`, `"function overhead() view returns (uint256)"`, `"function scalar() view returns (uint256)"`, `"function setEcotone()"`, `"function version() view returns (string)"`]\>, `"address"` \| `"events"` \| `"read"` \| `"write"`\> & `object`

## Example

```ts
import { createGasPriceOracle } from '@tevm/opstack'
const GasPriceOracle = createGasPriceOracle()
```

## Source

[extensions/opstack/src/contracts/l2/GasPriceOracle.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/extensions/opstack/src/contracts/l2/GasPriceOracle.ts#L13)
