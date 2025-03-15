import React from 'react'
import type { AppProps } from 'pastel'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
})

export default function App({ Component, commandProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...commandProps} />
    </QueryClientProvider>
  )
}