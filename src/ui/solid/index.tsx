/* @refresh reload */
import { render } from 'solid-js/web'
import App from './App'
import './styles/tailwind.css'

render(() => <App />, document.getElementById('root') as HTMLElement)
