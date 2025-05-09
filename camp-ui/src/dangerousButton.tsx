import {ReactNode, useRef, useState} from "react"

export function DangerousButton(props: { onClick: () => void, children: ReactNode }) {
    const [state, setState] = useState<"initial" | "delay" | "active">("initial")
    const timeouts = useRef<ReturnType<typeof setTimeout>[]>([])

    function delayed(sec: number, fn: () => void) {
        timeouts.current.push(setTimeout(fn, sec * 1000))
    }

    function abortAllDelayed() {
        timeouts.current.forEach(clearTimeout)
        timeouts.current = []
    }

    function label() {
        if (state === "initial") {
            return props.children
        } else if (state === "delay") {
            return "..."
        } else if (state === "active") {
            return "OK"
        }
    }

    function handleClick() {
        if (state === "initial") {
            setState("delay")
            delayed(3, () => {
                setState("active")
                delayed(2, () => {
                    setState("initial")
                })
            })
        } else if (state === "active") {
            abortAllDelayed()
            props.onClick()
            setState("initial")
        }
    }

    return <button disabled={state === "delay"}
                   style={{
                       width: "5em",
                       backgroundColor: state === "active" ? "lightsalmon" : undefined,
                   }}
                   onClick={handleClick}>{label()}</button>
}