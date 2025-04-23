import "./app.css"
import {DslEditor} from "../../camp-dsl/src"
import {useState} from "preact/compat"

export function App() {
    const [result, setResult] = useState({});
    return <div style={{display: "flex", position: "absolute", inset: 0}}>
        <DslEditor onChange={() => 0} importMetaUrl={import.meta.url}>
            .
        </DslEditor>
        <pre></pre>
    </div>
}

