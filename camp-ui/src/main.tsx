import {createRoot} from "react-dom/client"

import {App} from "./app.tsx"
import "./index.css"

const container = document.getElementById('app')!
const root = createRoot(container)
root.render(<App />)
