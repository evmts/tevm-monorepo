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
const SRC_DIR = path.join(__dirname, './src-viem');
const OUTPUT_BASE_DIR = path.join(__dirname, './src');

const mainFiles = glob.sync(path.join(SRC_DIR, '**/*.ts'), {
  ignore: ['**/*.test.ts', '**/*.bench.ts'],
});

const testFiles = glob.sync(path.join(SRC_DIR, '**/*.test.ts'), {
});

const asyncFunctions = ['placeholderAsyncFunction'];

let skippedFiles: string[] = [];
let processedFiles: string[] = [];
let processedTestFiles: string[] = [];

const moduleNames = [
  'viem/abi',
  'viem/accounts',
  'viem/actions',
  'viem/chains',
  'viem/contract',
  'viem/ens',
  'viem/public',
  'viem/test',
  'viem/utils',
  'viem/wallet',
  'viem/window',
  'viem',
]
const viemModules = await Promise.all(moduleNames.map(moduleName => import(moduleName)));

async function processFiles() {
  for (const file of mainFiles) {
    const baseName = path.basename(file, '.ts');
    const relativePath = path.relative(SRC_DIR, path.dirname(file));
    const outputPath = path.join(OUTPUT_BASE_DIR, relativePath);
    // Make the directory if it doesn't exist
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }

    // write the file as is first
    // fs.copyFileSync(file, path.join(outputPath, `${baseName}.ts`));

    const viemModule = viemModules.find(viemModule => viemModule[baseName])?.[baseName];

    if (!viemModule) {
      skippedFiles.push(baseName);
      continue;
    }

    const newFileName = path.join(outputPath, `${baseName}Effect.js`);

    const originalContent = fs.readFileSync(file, 'utf-8');

    const content = await generateContent(baseName, outputPath, originalContent);
    if (!content) {
      console.warn('Skipping', baseName, 'because it could not be generated')
      skippedFiles.push(baseName);
      continue;
    }
    fs.writeFileSync(newFileName, content);
    console.log('Generated', newFileName)
    processedFiles.push(baseName);
  }

  for (const file of testFiles) {
    const baseName = path.basename(file, '.test.ts');
    const relativePath = path.relative(SRC_DIR, path.dirname(file));
    const outputPath = path.join(OUTPUT_BASE_DIR, relativePath);

    // Make the directory if it doesn't exist
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }

    if (skippedFiles.includes(baseName)) {
      continue;
    }

    if (TODO_NOT_IMPLEMENTED) {
      continue;
    }

    const newTestFileName = path.join(outputPath, `${baseName}Effect.test.ts`);

    let testContent = fs.readFileSync(file, 'utf-8');
    testContent = transformTestFile(testContent, baseName);
    fs.writeFileSync(newTestFileName, testContent);
    console.log('Generated', newTestFileName)
    processedTestFiles.push(newTestFileName);
  }
}
async function generateContent(baseName: string, fileDir: string, originalContent: string): Promise<string> {
  const capitalizedErrorType = capitalizeFirstLetter(baseName) + 'ErrorType';
  const relativePath = getRelativePathToWrapInEffect(fileDir);
  const index = viemModules.findIndex(viemModule => viemModule[baseName]);
  const viemModule = moduleNames[index]
  if (!viemModule) {
    return '';
  }
  const viemError = `import("${viemModule}").${capitalizedErrorType}`;
  const isViemError = originalContent.includes(capitalizedErrorType);

  return `
import { ${baseName} } from "${viemModule}";
import { wrapInEffect } from '${relativePath}';

/**
 * @type {import("${relativePath}").WrappedInEffect<typeof ${baseName}, ${isViemError ? viemError : 'Error'}>}
 */
export const ${baseName}Effect = wrapInEffect(${baseName});
    `.trim();
}

const TODO_NOT_IMPLEMENTED = true

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
function getRelativePathToWrapInEffect(fileDir: string): string {
  // this is not working I'm just hardcoding -5 rather than debugging
  const depth = fileDir.replace(SRC_DIR, '').split(path.sep).filter(part => part).length - 5;
  return depth > 0 ? '../'.repeat(depth) + 'wrapInEffect.js' : './';
}

function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

processFiles().then(() => {
  console.log('Files processed successfully!');
  console.log(`Skipped files: ${skippedFiles.length}`);
  console.log(`Total files processed: ${processedFiles.length}`);
  console.log(`Total test files processed: ${processedTestFiles.length}`);
}).catch((error) => {
  console.error('An error occurred:', error);
});
