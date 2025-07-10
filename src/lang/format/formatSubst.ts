import { substEntries, type Subst } from "../subst/index.ts"
import { formatType } from "./formatType.ts"

export function formatSubst(subst: Subst): string {
  const lines = []
  for (const [name, type] of substEntries(subst)) {
    lines.push(`${name} ${formatType(type)}`)
  }

  return `(${lines.join("\n ")})`
}
