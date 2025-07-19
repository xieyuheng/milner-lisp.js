import { stringToSubscript } from "../string/stringToSubscript.ts"

const nameCounts: Map<string, number> = new Map()

export function globalFreshen(name: string): string {
  const count = nameCounts.get(name)
  if (count === undefined) {
    nameCounts.set(name, 0)
    return globalFreshen(name)
  }

  const freshName = stringToSubscript(`${name}${count + 1}`)
  nameCounts.set(name, count + 1)
  return freshName
}
