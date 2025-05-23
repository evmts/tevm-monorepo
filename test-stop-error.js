import { StopError } from './packages/errors/src/ethereum/ethereumjs/StopErrorError.js'
import { EVMErrorMessage } from '@ethereumjs/evm'

console.log('StopError class:', StopError)
console.log('StopError.EVMErrorMessage:', StopError.EVMErrorMessage)
console.log('EVMErrorMessage.STOP:', EVMErrorMessage.STOP)

const stopError = new StopError('Test stop error')
console.log('stopError instance:', stopError)
console.log('stopError.name:', stopError.name)
console.log('stopError.message:', stopError.message)
console.log('stopError._tag:', stopError._tag)