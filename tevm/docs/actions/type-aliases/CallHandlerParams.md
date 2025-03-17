[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / CallHandlerParams

# Type Alias: CallHandlerParams

> **CallHandlerParams**: [`CallParams`](../../index/type-aliases/CallParams.md) & [`CallEvents`](CallEvents.md)

Defined in: packages/actions/dist/index.d.ts:1193

Parameters for the call handler, extending CallParams with event handlers
These event handlers are not JSON-serializable, so they are kept separate from the base CallParams
