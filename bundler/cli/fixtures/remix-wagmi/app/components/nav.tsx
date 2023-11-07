import { Link } from "@remix-run/react";
import styles from './nav.module.css'

export default function NavBar() {
  return (
    <>
      <nav className={styles.navContainer}>
        <Link className={styles.homeStyle} to="/">Home</Link>
        <Link className={styles.linkStyle} to="/reads">Reads with viem and loaders</Link>
        <Link className={styles.linkStyle} to="/writes">Writes with wagmi</Link>
      </nav>
    </>
  );
}
