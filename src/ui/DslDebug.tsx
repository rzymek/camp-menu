export function DslDebug(props: { result: {} }) {
    return <pre>{JSON.stringify(
        props.result,
        (key, value) => key.startsWith("$") ? undefined : value,
        2,
    )}</pre>
}