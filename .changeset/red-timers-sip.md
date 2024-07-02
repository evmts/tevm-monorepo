---
"@tevm/procedures": patch
"@tevm/actions": patch
"@tevm/memory-client": minor
"tevm": patch
---

Added Load State and Dump State to the API.

These handlers allow one to read and write the entire tevm state similar to [load state and dump state in anvil](https://book.getfoundry.sh/reference/cli/anvil). This can be used to persist the state on disk or browser cache
