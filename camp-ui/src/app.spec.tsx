import {describe, expect, it} from "vitest";
import {render} from "@testing-library/preact";
import {App} from "./app.tsx";

describe("app", () => {
    it('should render', () => {
        const {baseElement} = render(<App/>);
        expect(baseElement.innerHTML).not.toEqual('')
    })
})