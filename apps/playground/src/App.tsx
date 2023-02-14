import { evmts, run } from '@evmts/core'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

const forgeScript = evmts`
contract Script {
    function run() external returns (string memory) {
        return "Hello, World!";
    }
}
`

const w = window as any
w.process = {
  env: {
    DEBUG: 'ethjs',
  },
}

export const App = () => {
  const [isEnabled, setIsEnabled] = useState(false)
  const { data, error, isLoading } = useQuery(
    ['helloWorldQuery'],
    async () => {
      return run(forgeScript)
    },
    { enabled: isEnabled },
  )
  return (
    <div>
      <button onClick={() => setIsEnabled(!isEnabled)}>Click to run tx</button>
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {(error as Error).message}</div>}
      {data && <div>{data}</div>}
    </div>
  )
}
