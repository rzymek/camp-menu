import LZString from "lz-string"

export function decodeSrc(search: string): string {
    const raw = search.replace(/^[?]src=/, "")
    return LZString.decompressFromEncodedURIComponent(raw) ?? decodeURIComponent(raw)
}