**@tevm/opstack** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > createSuperchainConfig

# Function: createSuperchainConfig()

> **createSuperchainConfig**(`chainId`): `Omit`\<`Script`\<`"SuperchainConfig"`, readonly [`"constructor()"`, `"function GUARDIAN_SLOT() view returns (bytes32)"`, `"function PAUSED_SLOT() view returns (bytes32)"`, `"function guardian() view returns (address guardian_)"`, `"function initialize(address _guardian, bool _paused)"`, `"function pause(string _identifier)"`, `"function paused() view returns (bool paused_)"`, `"function unpause()"`, `"function version() view returns (string)"`, `"event ConfigUpdate(uint8 indexed updateType, bytes data)"`, `"event Initialized(uint8 version)"`, `"event Paused(string identifier)"`, `"event Unpaused()"`]\>, `"address"` \| `"events"` \| `"read"` \| `"write"`\> & `object`

Creates a SuperchainConfig contract instance from a chainId
Currently only supports chainId 10

## Parameters

▪ **chainId**: `10`= `10`

## Returns

## Example

```ts
import { createSuperchainConfig } from '@tevm/opstack'
const SuperchainConfig = createSuperchainConfig()
```

## Source

[extensions/opstack/src/contracts/l1/SuperchainConfig.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/extensions/opstack/src/contracts/l1/SuperchainConfig.ts#L13)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
