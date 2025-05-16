---
"@tevm/txpool": patch
---

Fix events on tx added/removed from the pool:
- remove duplicate 'txadded' event in `onChainReorganization` then `addUnverified`
- remove 'txremoved' event in `onBlockAdded` to fire in `removeNewBlockTxs` instead
