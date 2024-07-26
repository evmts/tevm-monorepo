---
"@tevm/config": patch
---

Fixed bug with remappings sometimes failing to append the rootdir. This would not cause issues in most bundlers but did cause issues in ts-plugin in some setups
