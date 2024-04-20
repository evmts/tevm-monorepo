import fs from 'fs-extra'

const originalConsoleLog = console.log
const originalConsoleError = console.error
console.log = (...args) => {
	fs.appendFileSync('../debuglogs.txt', args.join(' ') + '\n')
	originalConsoleLog(...args)
}
console.error = (...args) => {
	fs.appendFileSync('../debuglogs.txt', args.join(' ') + '\n')
	originalConsoleError(...args)
}
export * from './InputStep.js'
export * from './MultipleChoice.js'
export * from './automatedSteps.js'
export * from './types.js'
