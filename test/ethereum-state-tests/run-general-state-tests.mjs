#!/usr/bin/env node
import { spawnSync } from 'node:child_process'
import { resolve } from 'node:path'

const argv = process.argv.slice(2)
const passThrough = argv.join(' ')
const fixtures = resolve('test/ethereum-state-tests/fixtures/general-state-tests/sample-fixtures.json')
const script = resolve('test/conformance-utils/run-fixture-suite.mjs')
const cmd = `node ${script} --suite=general-state-tests --fixtures=${fixtures} ${passThrough}`.trim()

const proc = spawnSync(cmd, { shell: true, stdio: 'inherit' })
process.exit(proc.status ?? 1)
