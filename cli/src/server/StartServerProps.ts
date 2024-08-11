import { options as optionsSchema } from './options.js'
import { z } from 'zod'

export type StartServerProps = {
	options: z.infer<typeof optionsSchema>
}
