import React from 'react'
import { z } from 'zod'
import { FancyCreateTitle } from '../../components/FancyCreateTitle.js'
import type { options } from './options.js'
import type { args } from './args.js'
import { NameStep } from './steps/NameStep.js'
import { useStore } from './state/Store.js'

type Props = {
  options: z.infer<typeof options>
  args: z.infer<typeof args>
}

export const Create: React.FC<Props> = ({ options, args: [defaultName] }) => {
  const store = useStore({ ...options, name: defaultName, currentStep: 0, nameInput: '' })

  return (
    <>
      <FancyCreateTitle />
      {(
        <>
          <NameStep
            defaultName={defaultName}
            {...store}
          />
        </>
      )}
    </>
  )
}

