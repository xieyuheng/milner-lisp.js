import type { Type } from "../type/index.ts"

export function formatType(type: Type): string {
  switch (type.kind) {
    case "TypeVar": {
      return type.name
    }

    case "Datatype": {
      const argsString = type.args.map(formatType).join(" ")
      return `(${type.name} ${argsString})`
    }

    case "Arrow": {
      return `(-> ${formatType(type.argType)} ${formatType(type.retType)})`
    }
  }
}
