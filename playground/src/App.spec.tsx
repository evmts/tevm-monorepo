import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import matchers from '@testing-library/jest-dom/matchers'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { App } from './App'

expect.extend(matchers)

afterEach(() => {
  cleanup()
})

describe.skip('evm-client MVP', () => {
  it('should render', async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <App />)
      </QueryClientProvider>,
    )
    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(await screen.findByText('Hello, World!')).toBeInTheDocument()
  })
})
