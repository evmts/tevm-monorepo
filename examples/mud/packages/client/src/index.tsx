import { App } from './App'
import { MUDProvider } from './MUDContext'
import { setup } from './mud/setup'
import { mount as mountDevTools } from '@latticexyz/dev-tools'
import ReactDOM from 'react-dom/client'

const rootElement = document.getElementById('react-root')
if (!rootElement) throw new Error('React root not found')
const root = ReactDOM.createRoot(rootElement)

// TODO: figure out if we actually want this to be async or if we should render something else in the meantime
setup().then((result) => {
	root.render(
		<MUDProvider value={result}>
			<App />
		</MUDProvider>,
	)
	mountDevTools()
})
