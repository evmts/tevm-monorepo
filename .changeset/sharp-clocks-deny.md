---
"@tevm/actions": patch
"@tevm/utils": patch
---

- Increased unit test coverage of tevm/actions to 87%
- fixed bug where we weren't properly returning tracing and access list information any errors happen during evm execution. Returning this information helps make debugging easier for users of tevm
- Fixed bug in callHandler where some validation errors were being swallowed
- fixed bug in setAccount and getAccount where some validation errors were being swallowed
- fixed bug with evm not reforking state manager in situation where forkUrl is set and blockTag for a call is before
- fixed bug with vm blockchainManager not being updated where forkUrl is set and blockTag for a call is before. This could cause state to leak from this call to the cannonical blockchain
- fixed bug with a bad blockTag causing an unexpected `InternalError` rather than `ForkError` to be thrown
- Fixed issue with stateOverrides not respecting the `code` property
- fixed issue where block.cliqueSigner() on forked blocks not properly throwing an error for not being a POA network
