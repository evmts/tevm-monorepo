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
const UTILS_DIR = path.join(__dirname, './src-viem/utils');
const OUTPUT_BASE_DIR = path.join(__dirname, './src');

const mainFiles = glob.sync(path.join(UTILS_DIR, '**/*(!(.test|.bench)).ts'), {
  ignore: [path.join(UTILS_DIR, 'unit/**'), path.join(UTILS_DIR, 'errors/**')] // Added the errors directory to ignore list
});

const testFiles = glob.sync(path.join(UTILS_DIR, '**/*.test.ts'), {
  ignore: [path.join(UTILS_DIR, 'errors/**')]  // Added the errors directory to ignore list
});

const asyncFunctions = ['placeholderAsyncFunction'];

let skippedFiles: string[] = [];

async function processFiles() {
  const viemModule = await import('viem/utils');

  for (const file of mainFiles) {
    const baseName = path.basename(file, '.ts');
    const relativePath = path.relative(UTILS_DIR, path.dirname(file));
    const outputPath = path.join(OUTPUT_BASE_DIR, relativePath);

    // Make the directory if it doesn't exist
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }

    if (viemModule[baseName] === undefined) {
      skippedFiles.push(baseName);
      continue;
    }

    const newFileName = path.join(outputPath, `${baseName}Effect.js`);

    const content = generateContent(baseName, outputPath);
    fs.writeFileSync(newFileName, content);
  }

  for (const file of testFiles) {
    const baseName = path.basename(file, '.test.ts');
    const relativePath = path.relative(UTILS_DIR, path.dirname(file));
    const outputPath = path.join(OUTPUT_BASE_DIR, relativePath);

    // Make the directory if it doesn't exist
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }

    if (skippedFiles.includes(baseName)) {
      continue;
    }

    const newTestFileName = path.join(outputPath, `${baseName}Effect.test.ts`);

    let testContent = fs.readFileSync(file, 'utf-8');
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
  const filename = `${baseName}.ts`;
  const ast = parse(content, {
    filename,
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
    },
    ImportDeclaration(path) {
      // This handles import specifiers to update the imported module
      for (const specifier of path.node.specifiers) {
        if (specifier.type === 'ImportSpecifier' || specifier.type === 'ImportDefaultSpecifier') {
          if (specifier.local.name === baseName) {
            path.node.source.value = path.node.source.value.replace(baseName, `${baseName}Effect`);
          }
        }
      }
    }
  });

  return transformFromAstSync(ast!, undefined, { filename })!.code!;
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
