[**@tevm/state**](../README.md)

***

[@tevm/state](../globals.md) / shallowCopy

# Function: shallowCopy()

> **shallowCopy**(`baseState`): () => [`BaseState`](../type-aliases/BaseState.md)

Defined in: packages/state/src/actions/shallowCopy.js:17

Returns a new instance of the ForkStateManager with the same opts but no storage copied over.

IMPORTANT: The fork cache is NOT copied but instead is shared between the original state
and the copied state. This is intentional and safe because:
1. Fork cache is read-only relative to the forked blockchain state at a specific block
2. Sharing the cache improves performance by preventing duplicate remote fetches
3. It enables persistent caching of fork data across VM instances

## Parameters

### baseState

[`BaseState`](../type-aliases/BaseState.md)

## Returns

> (): [`BaseState`](../type-aliases/BaseState.md)

### Returns

[`BaseState`](../type-aliases/BaseState.md)
