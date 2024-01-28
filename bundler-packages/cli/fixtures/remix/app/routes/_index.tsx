import styles from './links.module.css'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export default function App() {
	return (
		<div className={styles.container}>
			<h1 className={styles.header}>Welcome to EVMts Remix example</h1>
			<a
				target='_blank'
				href='https://remix.run/docs'
				rel='noreferrer'
				className={styles.linkStyle}
			>
				Remix Docs
			</a>
			<a
				target='_blank'
				href='https://github.com/evmts/evmts-monorepo'
				rel='noreferrer'
				className={styles.linkStyle}
			>
				EVMts Github
			</a>
			<div className={styles.connectButtonStyle}>
				<ConnectButton />
			</div>
		</div>
	)
}
