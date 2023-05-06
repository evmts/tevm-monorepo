import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { publicClient } from '../clients/publicClient'
import {
  PureQuery,
} from './PureQuery.s.sol'

const script = publicClient.script(PureQuery)

export const Pure = () => {
  const [num1, setNum1] = useState(0)
  const [num2, setNum2] = useState(0)
  const { data, error, isLoading } = useQuery(
    [PureQuery.id, num1, num2],
    async () => {
      return script
        // TODO abitype
        .run([num1, num2] as any)
        .then(res => {
          // TODO abitype
          return res.data as number
        })
    },
  )
  return (
    <div>
      <div>Testing a pure query</div>
      <div>This pure script does not read/write to state</div>
      <div>This is testing that the vm is executing</div>
      <div>Change the inputs and a query will execute</div>
      <div>
        <input
          type="number"
          value={num1}
          onChange={(e) => setNum1(Number(e.target.value))}
        />{' '}
        +
        <input
          type="number"
          value={num2}
          onChange={(e) => setNum2(Number(e.target.value))}
        />{' '}
        =<div id="data">{data}</div>
        {error ? <div>{JSON.stringify(error)}</div> : null}
        {isLoading && <div>Loading...</div>}
      </div>
    </div>
  )
}
