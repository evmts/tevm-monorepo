**@tevm/opstack** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > createDelayedVetoable

# Function: createDelayedVetoable()

> **createDelayedVetoable**(`chainId`): `Omit`\<`Script`\<`"DelayedVetoable"`, readonly [`"constructor(address vetoer_, address initiator_, address target_, uint256 operatingDelay_)"`, `"fallback()"`, `"function delay() returns (uint256 delay_)"`, `"function initiator() returns (address initiator_)"`, `"function queuedAt(bytes32 callHash) returns (uint256 queuedAt_)"`, `"function target() returns (address target_)"`, `"function version() view returns (string)"`, `"function vetoer() returns (address vetoer_)"`, `"event DelayActivated(uint256 delay)"`, `"event Forwarded(bytes32 indexed callHash, bytes data)"`, `"event Initiated(bytes32 indexed callHash, bytes data)"`, `"event Vetoed(bytes32 indexed callHash, bytes data)"`, `"error AlreadyDelayed()"`, `"error ForwardingEarly()"`, `"error TargetUnitialized()"`, `"error Unauthorized(address expected, address actual)"`]\>, `"address"` \| `"events"` \| `"read"` \| `"write"`\> & `object`

Creates a DelayedVetoable contract instance from a chainId
Currently only supports chainId 10

## Parameters

▪ **chainId**: `10`= `10`

## Returns

## Example

```ts
import { createDelayedVetoable } from '@tevm/opstack'
const DelayedVetoable = createDelayedVetoable()
```

## Source

[extensions/opstack/src/contracts/l1/DelayedVetoable.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/extensions/opstack/src/contracts/l1/DelayedVetoable.ts#L13)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
