import {configureMonacoWorkers} from "../setupCommon.js"
import {DslEditorInstance, executeClassic} from "../setupClassic.js"
import {useEffect, useRef} from "preact/hooks"
import {createParser} from "../api/parser.js"
import {LangiumDocument} from "langium"
import {Model} from "../language/generated/ast.js"

configureMonacoWorkers()

const parser = createParser()

export function DslEditor(props: {
    children: string,
    onChange(value: LangiumDocument<Model>): void,
    importMetaUrl: string
}) {
    const ref = useRef<HTMLDivElement>(null)
    const wrapper = useRef<Promise<DslEditorInstance>>(null)
    useEffect(() => {
        (async () => {
            if (!ref.current) return
            wrapper.current = executeClassic(ref.current, {
                code: props.children,
                async onChange(text) {
                    const result = await parser(text)
                    props.onChange(result)
                },
            })
        })()
        return () => {
            wrapper.current?.then(i => i.dispose())
        }
    }, [props.children])
    return <div ref={ref} style={{flex: 1}}/>
}