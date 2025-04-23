import "./app.css"
import {DslEditor} from "../../camp-dsl/src"

export function App() {
    return <div style={{display: "flex", position: "absolute", inset: 0}}>
        <DslEditor onChange={() => 0} importMetaUrl={import.meta.url}>
            .
        </DslEditor>
    </div>
}

