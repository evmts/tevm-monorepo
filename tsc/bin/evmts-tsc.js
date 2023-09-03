#!/usr/bin/env node
const semver = require('semver')
const fs = require('fs');
const tsPkg = require('typescript/package.json');
const readFileSync = fs.readFileSync;
const tscPath = require.resolve('typescript/lib/tsc');
const proxyApiPath = require.resolve('../dist/index');
const { state } = require('../dist/shared');

// This hack was originally adapted from vue-tsc
fs.readFileSync = (...args) => {
	if (args[0] === tscPath) {
		let tsc = readFileSync(...args);

		// add *.sol files to allow extensions
		tryReplace(/supportedTSExtensions = .*(?=;)/, s => `${s}.concat([[".sol"]])`);
		tryReplace(/supportedJSExtensions = .*(?=;)/, s => `${s}.concat([[".sol"]])`);
		tryReplace(/allSupportedExtensions = .*(?=;)/, s => `${s}.concat([[".sol"]])`);

		// proxy createProgram apis
		tryReplace(/function createProgram\(.+\) {/, s => `${s} return require(${JSON.stringify(proxyApiPath)}).createProgram(...arguments);`);

		// patches logic for checking root file extension in build program for incremental builds
		if (semver.gt(tsPkg.version, '5.0.0')) {
			tryReplace(
				'for (const existingRoot of buildInfoVersionMap.roots) {',
				`for (const existingRoot of buildInfoVersionMap.roots
					.filter(file => !file.toLowerCase().includes('__vls_'))
					.map(file => file.replace(/\.sol\.(j|t)sx?$/i, '.sol'))
				) {`
			);
		}
		if (semver.gte(tsPkg.version, '5.0.4')) {
			tryReplace(
				'return createBuilderProgramUsingProgramBuildInfo(buildInfo, buildInfoPath, host);',
				s => `buildInfo.program.fileNames = buildInfo.program.fileNames
					.filter(file => !file.toLowerCase().includes('__vls_'))
					.map(file => file.replace(/\.sol\.(j|t)sx?$/i, '.sol'));\n${s}`
			);
		}

		return tsc;

		function tryReplace(search, replace) {
			const before = tsc;
			tsc = tsc.replace(search, replace);
			const after = tsc;
			if (after === before) {
				throw `Search string not found: ${JSON.stringify(search.toString())}` ;
			}
		}
	}
	return readFileSync(...args);
};

(function main() {
	try {
		require(tscPath);
	}
	catch (err) {
		if (err === 'hook') {
			state.hook.worker.then(main);
		}
		else {
			throw err;
		}
	}
})();
