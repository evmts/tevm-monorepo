import 'tailwindcss/tailwind.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from 'react-error-boundary'
import { App } from './App'
import { Explorer } from './mud/Explorer'
import { Providers } from './Providers'
import { ErrorFallback } from './ui/ErrorFallback'

createRoot(document.getElementById('react-root')!).render(
	<StrictMode>
		<ErrorBoundary FallbackComponent={ErrorFallback}>
			<Providers>
				<App />
				<Explorer />
			</Providers>
		</ErrorBoundary>
	</StrictMode>,
)
