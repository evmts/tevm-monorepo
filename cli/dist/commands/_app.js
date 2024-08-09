export default function App({ Component, commandProps }) {
    return React.createElement(Component, { ...commandProps });
}
