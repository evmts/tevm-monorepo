[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / CallHandlerParams

# Type Alias: CallHandlerParams

> **CallHandlerParams** = [`CallParams`](CallParams.md) & [`CallEvents`](CallEvents.md)

Defined in: [packages/actions/src/Call/CallHandlerType.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/CallHandlerType.ts#L9)

Parameters for the call handler, extending CallParams with event handlers
These event handlers are not JSON-serializable, so they are kept separate from the base CallParams
