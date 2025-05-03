import "./app.css"
import {DslDebug, DslEditor} from "../../camp-dsl/src"
import {useState} from "preact/compat"

export function App() {
    const [result, setResult] = useState({})
    return <div style={{display: "flex", flexDirection: "column", position: "absolute", inset: 0}}>
        <DslEditor onChange={setResult} importMetaUrl={import.meta.url}>
            {``}
        </DslEditor>
        <div style={{flex: 1}}>
            <DslDebug result={result}/>
        </div>
    </div>
}

