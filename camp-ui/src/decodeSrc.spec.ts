import {describe, expect, it} from "vitest"
import {decodeSrc} from "./decodeSrc.ts";

describe("decodeSrc", () => {
  it("decompresses lz-compressed query string", () => {
    const search = `?src=HYSwpgJgXuA2CGACAFANgJQC4BQi+ICt4CwBjKUUpKRABwHsBbECegJ3md3wBd6BnHgE8UAVnQAaRH0EiA7mADmYFAEZ03PLQ6AfQHrAA1kjTogA`
    expect(decodeSrc(search)).toBe(`niedziela (6):
    jajecznica z pomidorami
    tosty (5), tosty wege (1)
    prażonka (6)`)
  })

  it("falls back to plain text when decompression fails", () => {
    const search = `?src=niedziela (6)%3A%0A%20%20%20 jajecznica z pomidorami%0A%20%20%20 tosty (5)%2C tosty wege (1)%0A%20%20%20 prażonka (6)`
    expect(decodeSrc(search)).toBe(`niedziela (6):
    jajecznica z pomidorami
    tosty (5), tosty wege (1)
    prażonka (6)`)
  })
})
