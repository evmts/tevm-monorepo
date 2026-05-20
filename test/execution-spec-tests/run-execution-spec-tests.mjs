#!/usr/bin/env node
import { spawnSync } from 'node:child_process'
import { resolve } from 'node:path'

const argv = process.argv.slice(2)
const passThrough = argv.join(' ')
const fixtures = resolve('test/execution-spec-tests/fixtures/scoped/sample-fixtures.json')
const script = resolve('test/conformance-utils/run-fixture-suite.mjs')
const cmd = `node ${script} --suite=execution-spec-tests --fixtures=${fixtures} ${passThrough}`.trim()

const proc = spawnSync(cmd, { shell: true, stdio: 'inherit' })
process.exit(proc.status ?? 1)
