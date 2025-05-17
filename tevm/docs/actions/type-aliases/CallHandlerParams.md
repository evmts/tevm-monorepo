[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / CallHandlerParams

# Type Alias: CallHandlerParams

> **CallHandlerParams** = [`CallParams`](CallParams.md) & [`CallEvents`](CallEvents.md)

Defined in: packages/actions/types/Call/CallHandlerType.d.ts:8

Parameters for the call handler, extending CallParams with event handlers
These event handlers are not JSON-serializable, so they are kept separate from the base CallParams
