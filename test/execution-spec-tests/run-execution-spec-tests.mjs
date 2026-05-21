#!/usr/bin/env node
import { spawnSync } from 'node:child_process'
import { resolve } from 'node:path'

const argv = process.argv.slice(2)
const fixtures = process.env.TEVM_EXECUTION_SPEC_TESTS_FIXTURES
const script = resolve('test/conformance-utils/run-fixture-suite.mjs')
const args = [script, '--suite=execution-spec-tests', ...(fixtures ? [`--fixtures=${fixtures}`] : []), ...argv]

const proc = spawnSync(process.execPath, args, { stdio: 'inherit' })
process.exit(proc.status ?? 1)
