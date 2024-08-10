import { z } from 'zod'
import { options as optionsSchema } from './options.js'

export type StartServerProps = {
	options: z.infer<typeof optionsSchema>
}
