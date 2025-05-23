import {configureMonacoWorkers} from "../setupCommon.js"
import {DslEditorInstance, executeClassic} from "../setupClassic.js"
import {useEffect, useRef} from "react"
import {createParser, Plan} from "../api/parser.js"

export type {LangiumDocument} from "langium"

export function DslEditor(props: {
    children: string,
    onChange(value: Plan[], text:string): void,
    importMetaUrl: string,
    external: {
        MealProvider(): {
            getMeals(): Promise<{ title: string }[]>
        }
    }
}) {
    const ref = useRef<HTMLDivElement>(null)
    const wrapper = useRef<DslEditorInstance>(null)
    useEffect(() => {
        (async () => {
            if (!ref.current) return
            configureMonacoWorkers()
            const parser = createParser()
            const editor: DslEditorInstance = await executeClassic(ref.current, {
                code: props.children,
                async onChange(text) {
                    const result = await parser(text)
                    props.onChange(result.plan, text)
                },
            })
            wrapper.current = editor
            const mealProvider = props.external.MealProvider()
            const meals = await mealProvider.getMeals()
            await editor.updateCompletionData(meals.map(meal => meal.title))
        })()
        return () => {
            wrapper.current?.dispose()
        }
    }, [])
    useEffect(() => {
        if (!wrapper.current) return
        wrapper.current.code = props.children
    }, [props.children])
    return <div ref={ref} style={{flex: 1}}/>
}