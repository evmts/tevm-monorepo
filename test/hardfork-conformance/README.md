# Hardfork Conformance: Verkle Transition Vectors

Run a scoped Osaka Verkle subset:

```bash
pnpm test:conformance:verkle
```

Run all Verkle vectors (including negative witness cases):

```bash
pnpm test:conformance:verkle:all
```

Artifacts are written to `artifacts/verkle-conformance/*.json` for Smithers debugging workflows.
Each vector result includes hardfork and EIP context.

Known upstream Osaka/Verkle parity gaps are tracked in
`test/hardfork-conformance/vectors/verkle/KNOWN_GAPS.md`.
