import { useState } from 'react'

import { Pure } from './pure/Pure'

const w = window as any
w.process = {
  env: {
    DEBUG: 'ethjs',
  },
}

const options = [Pure]

export const App = () => {
  const [selected, setSelected] = useState(Pure.name)
  return (
    <div>
      <div>
        {options.map((Option) => (
          <button key={Option.name} onClick={() => setSelected(Option.name)}>
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
