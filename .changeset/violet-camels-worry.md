---
"@evmts/bundler": patch
---

Fixed version of plugin defaulting to 0.0.0 instead of the package.json version

Previously the version of all evmts-plugins were hardcoded to 0.0.0. Now they will correctly show the correct version.
