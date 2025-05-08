export function createIndex<T>(array: T[], keyExtractor: (x: T) => string): Map<string, T> {
    const map = new Map<string, T>()
    array.forEach(it => {
        map.set(keyExtractor(it), it)
    })
    return map
}