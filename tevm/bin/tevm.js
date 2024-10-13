#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { access, mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { Command } from 'commander';
import { bundler } from '@tevm/base-bundler';
import { createCache } from '@tevm/bundler-cache';
import { loadConfig } from '@tevm/config';
import { runSync } from 'effect/Effect';
import { glob } from 'glob';
// @ts-expect-error
import * as solc from 'solc';

/**
 * @typedef {import('@tevm/base-bundler').FileAccessObject} FileAccessObject
 */

/** @type {FileAccessObject} */
const fao = {
  existsSync: existsSync,
  readFile: readFile,
  readFileSync: readFileSync,
  writeFileSync: writeFileSync,
  statSync,
  stat,
  mkdirSync,
  mkdir,
  writeFile,
  exists: async (path) => {
    try {
      await access(path);
      return true;
    } catch (e) {
      return false;
    }
  },
};

/**
 * Generate types from Solidity contracts.
 * 
 * @param {string} cwd - The current working directory.
 * @param {string[]} include - The glob pattern to include Solidity files.
 */
const generate = (cwd, include) => {
  console.log('Generating types from contracts...', { dir: cwd, include });
  const files = glob.sync(include, { cwd });
  if (files.length === 0) {
    throw new Error('No files found');
  }
  files.forEach(async (file) => {
    const fileName = file.split('/').at(-1);
    const fileDir = file.split('/').slice(0, -1).join('/');
    const config = runSync(loadConfig(cwd));
    const solcCache = createCache(config.cacheDir, fao, cwd);
    const plugin = bundler(config, console, fao, solc, solcCache);
    const tsContent = await plugin.resolveTsModule(`./${file}`, cwd, false, true);
    await writeFile(path.join(fileDir, `${fileName}.ts`), tsContent.code);
  });
};

// Initialize Commander
const program = new Command();

program
  .name('tevm')
  .description('TEVM CLI')
  .version('1.0.0');

program
  .command('gen')
  .description('Generate types from Solidity contracts. If files in in .s.sol it will also compile bytecode')
  .argument('<include>', 'Glob pattern to include Solidity files')
  .option('-c, --config <path>', 'Path to the configuration file', process.cwd())
  .action((include, options) => {
    const cwd = options.config || process.cwd();
    const includePattern = include.split(',');
    generate(cwd, includePattern);
  });

// Parse the arguments
program.parse(process.argv);

