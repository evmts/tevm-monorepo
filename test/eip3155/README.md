# EIP-3155 Trace Tools

The trace tools normalize Tevm `debug_*`/`structLogs` output into EIP-3155 JSONL
shape and compare traces by first divergence. They do not execute synthetic
state-test fixtures and do not count as conformance coverage by themselves.

Convert a Tevm trace artifact:

```bash
pnpm test:eip3155:convert -- --input=artifacts/debug-trace.json --out=artifacts/eip3155/trace.jsonl
```

Compare with a reference trace:

```bash
pnpm test:eip3155:compare -- --actual=artifacts/eip3155/trace.jsonl --reference=artifacts/eip3155/reference.jsonl --out=artifacts/eip3155/trace-diff.json
```

The comparison output is written as JSON with `status: "passed"`,
`status: "failed"`, or `status: "skipped"`. Missing actual/reference files are
reported as skipped with `coverage: "none"` unless `--require-files=true` is
provided.
