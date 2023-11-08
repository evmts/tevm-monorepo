import { args } from './args.js'
import { options } from './options.js'
import { Create } from './Create.js'

export const command = {
  args,
  options,
  Component: Create,
}
