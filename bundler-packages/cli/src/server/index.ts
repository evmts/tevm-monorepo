import { Server } from './Server.js'
import { args } from './args.js'
import { options } from './options.js'

export const command = {
args,
options,
Component: Server,
}
