import type { Type, TypeScheme } from "../type/index.ts"

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

export function formatTypeScheme(typeScheme: TypeScheme): string {
  if (typeScheme.kind === "Nu") {
    const namesString = typeScheme.names.join(" ")
    return `(nu (${namesString}) ${formatType(typeScheme.type)})`
  }

  return formatType(typeScheme)
}
