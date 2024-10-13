---
"@tevm/config": minor
---

Added jsonAbiAsConst feature to tevm config. By passing in a glob or an array of globs tevm will force TypeScript to resolve json abis as const. Note: this only affects your editor and to have this happen at buildtime you must also use the tevm wrapper around the ts compiler
