Guillotine + Voltaire Migration Plan

Status: in progress

Summary:
- Added submodules: `lib/guillotine-mini` (EVM) and `lib/voltaire` (provider + primitives).
- Began replacing viem with Voltaire in `@tevm/node` and root `tevm` package types.
- Planned replacement of `@tevm/evm` (ethereumjs) with `guillotine-mini` adapter.

Breaking Changes (so far):
- `tevm` no longer re-exports `tevmTransport` from `@tevm/viem`.
- `@tevm/node` EIP-1193 types import from `@tevm/voltaire/provider` instead of `viem`.
- `viem` peerDependency removed from `tevm` and `@tevm/node`.

Planned Breaking Changes (upcoming):
- Replace `@tevm/evm` (ethereumjs) with a `guillotine-mini`-backed implementation. During the transition, some advanced EVM features (custom precompiles, tracing internals, deep-copy semantics) may be temporarily unavailable.
- Remove all remaining `@ethereumjs/*` dependencies across packages, migrating to Voltaire primitives where applicable.
- Remove `viem` usage across all packages (e.g. decorators, utils, http-client) in favor of Voltaire’s provider and utility APIs.

Migration Notes:
- EIP-1193: adopt Voltaire’s `EIP1193RequestFn`/`EIP1193Provider` from `@tevm/voltaire/provider`.
- Transport: prefer `HttpProvider`/`WebSocketProvider`/`InMemoryProvider` from Voltaire rather than viem transports.
- EVM: `guillotine-mini` will become the execution engine for `@tevm/evm`. If feature parity is missing, we will intentionally ship with gaps and fill them iteratively.

Open Work:
- Implement `@tevm/evm` adapter on top of `guillotine-mini`.
- Replace `@ethereumjs/*` types in `@tevm/utils`, `@tevm/vm`, and related packages.
- Update decorators to remove viem references (retry/backoff, schemas) and use Voltaire equivalents.

Rationale:
- Align execution and provider stacks with the Tevm native projects.
- Drop heavy dependencies and tailor APIs to Tevm’s needs.

