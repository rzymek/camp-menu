import "./app.css"
import {DslEditor, DslDebug} from "../../camp-dsl/src"
import {useState} from "preact/compat"

export function App() {
    const [result, setResult] = useState({})
    return <div style={{display: "flex", flexDirection: "column", position: "absolute", inset: 0}}>
        <DslEditor onChange={setResult} importMetaUrl={import.meta.url}>
{`czw: (5)
    m1 (5)
    m2
pt: (3)
    m2 (4)
    m3
`}
        </DslEditor>
        <div style={{flex: 1}}>
        <DslDebug result={result}/>
        </div>
    </div>
}

