export const sleep = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

export const numAddComma = (v: number): string => {
    return v.toLocaleString()
}
