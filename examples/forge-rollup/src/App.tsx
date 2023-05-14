import { useState } from 'react'

import { Pure } from './pure/Pure'
import { ExecuteScript } from './script/executeScript'

const options = [Pure, ExecuteScript]

export const App = () => {
  const [selected, setSelected] = useState(Pure.name)
  return (
    <div>
      <div>
        {options.map((Option) => (
          <button
            type='button'
            key={Option.name}
            onClick={() => setSelected(Option.name)}
          >
            {Option.name}
          </button>
        ))}
      </div>
      <div>
        {options.map((Option) => Option.name === selected && <Option />)}
      </div>
    </div>
  )
}
