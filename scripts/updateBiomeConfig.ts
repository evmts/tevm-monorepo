import fs from 'node:fs'
import { join } from 'node:path'
import recursive from 'recursive-readdir'

const biomeConfig = {
	$schema: './node_modules/@biomejs/biome/configuration_schema.json',
	organizeImports: {
		enabled: true,
	},
	files: {
		ignore: [
			'.nx',
			'node_modules',
			'package.json',
			'**/package.json',
			'**/coverage',
			'**/node_modules',
			'**/dist',
			'**/types',
			'**/artifacts',
			'**/lib',
			'**/fixtures',
			'**/.next',
			'**/.vitepress/cache',
			'**/.vitepress/dist',
			'scaffold-tevm',
			'docs/**/*',
			'tevm/**/*',
			'bundler/**/*',
			'.vscode',
			'.changeset',
			'.devcontainer',
			'examples/svelte-ethers/.svelte-kit',
			'examples/next',
			'bundler-packages/cli',
			'experimental/viem-effect',
			'bundler-packages/config/src/fixtures',
			'bundler-packages/cli/fixtures',
		],
	},
	formatter: {
		enabled: true,
		formatWithErrors: false,
		indentStyle: 'tab',
		indentWidth: 2,
		lineWidth: 120,
	},
	linter: {
		enabled: true,
		rules: {
			recommended: true,
			style: {
				useImportType: 'off',
			},
			performance: {
				noDelete: 'off',
				noAccumulatingSpread: 'off',
			},
			complexity: {
				noForEach: 'off',
				noBannedTypes: 'off',
				useLiteralKeys: 'off',
			},
			suspicious: {
				noExplicitAny: 'off',
				noGlobalAssign: 'off',
				noArrayIndexKey: 'off',
				noConfusingVoidType: 'off',
				noAssignInExpressions: 'off',
				noRedeclare: 'off',
			},
		},
	},
	javascript: {
		formatter: {
			quoteStyle: 'single',
			trailingComma: 'all',
			semicolons: 'asNeeded',
		},
	},
}

const root = join(__dirname, '..')

console.log(`writing following config to all files in ${root}...`, biomeConfig)

recursive(
	root,
	[
		(file, stats) => {
			// for the love of god do not accidentally overwrite .git!
			if (file.includes('.git')) return true
			if (file.includes('node_modules')) return true
			if (!stats.isDirectory() && !file.includes('biome.json')) return true
			return false
		},
	],
	(err, files) => {
		if (err) {
			console.error(err)
			return
		}
		files.forEach((file) => {
			console.log('processing...', file)
			fs.readFile(file, 'utf8', (err, _data) => {
				if (err) {
					console.error(err)
					return
				}
				const updatedData = JSON.stringify(biomeConfig, null, 2)
				console.log('updating...', file)
				fs.writeFile(file, updatedData, { encoding: 'utf8', flag: 'w' }, (err) => {
					if (err) {
						console.error(err)
						return
					}
					console.log(`Updated file: ${file}`)
				})
			})
		})
	},
)
