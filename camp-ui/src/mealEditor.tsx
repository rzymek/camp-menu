import {DslEditor} from "../../meal-dsl/src/ui/DslEditor.tsx"
import {useEffect, useState} from "react"
import {createRoot} from "react-dom/client"

function MealEditor() {
    const [src, setSrc] = useState<string>()
    useEffect(() => {
        fetch("meals.md").then(r => r.text()).then(setSrc)
    }, [])
    return <div style={{display: "flex", position: "absolute", inset: 0}}>
        {src && <DslEditor onChange={(value) => {
            console.log(value.parseResult.value);
        }} importMetaUrl={import.meta.url}>{src}</DslEditor>}
    </div>
}

const container = document.getElementById('app')!
const root = createRoot(container)
root.render(<MealEditor />)
