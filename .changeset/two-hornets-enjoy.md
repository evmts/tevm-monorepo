---
"@tevm/memory-client": minor
"@tevm/state": minor
---

Improved performance by persisting fork cache across VM instances:

- Modified `deepCopy.js` and `shallowCopy.js` to share the fork cache object reference between original and copied state
- Implemented hierarchical cache lookup: first check main cache, then fork cache, then fetch from remote provider
- Stores data fetched from remote providers in both caches for future access
- Eliminated redundant remote provider calls when using cloned VMs
- Significantly reduced network latency for transaction simulations and gas estimations
- Maintained complete type safety and backward compatibility
- Enhanced documentation explaining the fork cache persistence approach
- Added tests to verify proper cache sharing behavior
