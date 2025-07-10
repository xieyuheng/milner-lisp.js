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
      const [argTypes, retType] = flattenArrow([type.argType], type.retType)
      const argTypesString = argTypes.map(formatType).join(" ")
      return `(-> ${argTypesString} ${formatType(retType)})`
    }
  }
}

function flattenArrow(
  argTypes: Array<Type>,
  retType: Type,
): [argTypes: Array<Type>, retType: Type] {
  if (retType.kind === "Arrow") {
    return flattenArrow([...argTypes, retType.argType], retType.retType)
  } else {
    return [argTypes, retType]
  }
}

export function formatTypeScheme(typeScheme: TypeScheme): string {
  if (typeScheme.kind === "Nu") {
    const namesString = typeScheme.names.join(" ")
    return `(nu (${namesString}) ${formatType(typeScheme.type)})`
  }

  return formatType(typeScheme)
}
