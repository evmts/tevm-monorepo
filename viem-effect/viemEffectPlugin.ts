// Generates src from src-viem
// src-viem is a copy paste of the latest src dir in viem
// we iterate through all the files generating an Effect version of the files
// We even attempt to update the tests
// If we are more or less successful such that we can quickly manually fix the rest of the errors we call it a day
// All .bench.ts files are ignored
import * as glob from 'glob';
import * as fs from 'fs';
import * as path from 'path';
import { parse, transformFromAstSync } from '@babel/core';
import traverse from '@babel/traverse';
import template from '@babel/template';

const UTILS_DIR = path.join(__dirname, '../../src/utils');

const mainFiles = glob.sync(path.join(UTILS_DIR, '**/*(!(.test|.bench)).ts'), {
  ignore: [path.join(UTILS_DIR, 'unit/**')]
});

const testFiles = glob.sync(path.join(UTILS_DIR, '**/*.test.ts'));

const asyncFunctions = ['placeholderAsyncFunction'];

let skippedFiles: string[] = [];

async function processFiles() {
  const viemModule = await import('viem/utils');

  for (const file of mainFiles) {
    const baseName = path.basename(file, '.ts');
    const fileDir = path.dirname(file);

    if (viemModule[baseName] === undefined) {
      skippedFiles.push(baseName);
      continue;
    }

    const newFileName = path.join(fileDir, `${baseName}Effect.js`);
    fs.renameSync(file, newFileName);

    const content = generateContent(baseName, fileDir);
    fs.writeFileSync(newFileName, content);
  }

  for (const file of testFiles) {
    const baseName = path.basename(file, '.test.ts');

    if (skippedFiles.includes(baseName)) {
      continue;
    }

    const newTestFileName = path.join(path.dirname(file), `${baseName}Effect.test.ts`);
    fs.renameSync(file, newTestFileName);

    let testContent = fs.readFileSync(newTestFileName, 'utf-8');
    testContent = transformTestFile(testContent, baseName);
    fs.writeFileSync(newTestFileName, testContent);
  }
}

function generateContent(baseName: string, fileDir: string): string {
  const capitalizedErrorType = capitalizeFirstLetter(baseName) + 'ErrorType';
  const relativePath = getRelativePathToWrapViemSync(fileDir);
  const wrapFunction = asyncFunctions.includes(baseName) ? 'wrapViemAsync' : 'wrapViemSync';

  return `
import { ${baseName} } from 'viem/utils';
import { ${wrapFunction} } from '${relativePath}';

/**
 * @type {import('${relativePath}').WrapedViemFunction<typeof ${baseName}, import("viem/utils").${capitalizedErrorType}>}
 */
export const Effect = ${wrapFunction}(${baseName});
    `.trim();
}

function transformTestFile(content: string, baseName: string): string {
  const ast = parse(content, {
    presets: ['@babel/preset-typescript'],
    sourceType: 'module'
  });

  traverse(ast!, {
    Identifier(path) {
      if (path.node.name === baseName) {
        path.node.name = `${baseName}Effect`;
      }
    },
    CallExpression(path) {
      if (path.node.callee.name === `${baseName}Effect`) {
        const wrappedCall = template.expression.ast`Effect.runSync(${baseName}Effect())`;
        path.replaceWith(wrappedCall);
      }
    }
  });

  return transformFromAstSync(ast!)!.code!;
}

function getRelativePathToWrapViemSync(fileDir: string): string {
  const depth = fileDir.replace(UTILS_DIR, '').split(path.sep).filter(part => part).length;
  return '../'.repeat(depth) + 'wrapViemSync.js';
}

function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

processFiles().then(() => {
  console.log('Files processed successfully!');
}).catch((error) => {
  console.error('An error occurred:', error);
});
