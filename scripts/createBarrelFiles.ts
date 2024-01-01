import fs from 'fs'
import path from 'path'

// Directory to scan (current directory in this case)
const directory = process.cwd()

if (fs.existsSync(path.join(directory, 'index.js'))) {
	fs.rmSync(path.join(directory, 'index.js'), { force: true })
} else if (fs.existsSync(path.join(directory, 'index.ts'))) {
	fs.rmSync(path.join(directory, 'index.ts'), { force: true })
}

fs.writeFileSync(path.join(directory, 'index.js'), '', 'utf8')
fs.writeFileSync(path.join(directory, 'index.ts'), '', 'utf8')

fs.readdir(directory, (err, files) => {
	console.log(directory)
	if (err) {
		console.error('Error reading the directory:', err)
		return
	}

	files.forEach((file) => {
		console.log(file)
		if (file.includes('index')) return
		if (file.includes('.spec.')) return
		const base = file.replace(/\.js$/, '').replace(/\.ts$/, '')
		fs.appendFileSync(
			path.join(directory, 'index.js'),
			`export * from './${base}.js';\n`,
			'utf8',
		)
		fs.appendFileSync(
			path.join(directory, 'index.ts'),
			`export type * from './${base}.js';\n`,
			'utf8',
		)
	})
	console.log('Export statements added to index.ts and index.js')
})
