# RPC Parity Matrix

Canonical extension namespace is `tevm_*`.

This matrix is backed by `packages/actions/src/rpcMethodMatrix.ts` and excludes Voltaire primitives and Guillotine Mini engine swap work.

## Status legend
- supported: registered in `createHandlers`
- missing: typed/docs surface exists but not currently registered
- intentionally_unsupported: explicit policy choice
- blocked: excluded by scoped dependency work

## Missing groups and follow-up tickets
- `tevm_mine` registration mismatch: `.smithers/tickets/010-rpc-tevm-mine-registration.md`
- `eth_sign`, `eth_signTransaction`: `.smithers/tickets/011-rpc-eth-signing-methods.md`
- Uncle/hashrate methods: `.smithers/tickets/012-rpc-eth-uncle-and-hashrate.md`
