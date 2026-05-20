# Hardfork Conformance

Verkle/EIP-6800 witness execution is intentionally unsupported in Tevm.

This directory does not contain Verkle transition vectors, and there is no
`test:conformance:verkle` command. Do not add synthetic Verkle coverage here.

If EIP-6800 is activated accidentally, VM block execution rejects it with an
explicit unsupported Verkle/state-witness error rather than attempting partial
or placeholder execution.
