#!/usr/bin/env node
import { spawnSync } from 'node:child_process'
import { resolve } from 'node:path'

const argv = process.argv.slice(2)
const passThrough = argv.join(' ')
const fixtures = process.env.TEVM_EXECUTION_SPEC_TESTS_FIXTURES
const script = resolve('test/conformance-utils/run-fixture-suite.mjs')
const fixtureArg = fixtures ? `--fixtures=${fixtures}` : ''
const cmd = `node ${script} --suite=execution-spec-tests ${fixtureArg} ${passThrough}`.trim()

const proc = spawnSync(cmd, { shell: true, stdio: 'inherit' })
process.exit(proc.status ?? 1)
