import { setDifference, setUnion, setUnionMany } from "../../utils/set/Set.ts"
import type { Type } from "./Type.ts"

export function typeFreeNames(type: Type): Set<string> {
  switch (type.kind) {
    case "TypeVar": {
      return new Set([type.name])
    }

    case "Datatype": {
      return setUnionMany(type.args.map(typeFreeNames))
    }

    case "Arrow": {
      return setUnion(typeFreeNames(type.argType), typeFreeNames(type.retType))
    }

    case "Nu": {
      return setDifference(typeFreeNames(type.type), new Set(type.names))
    }
  }
}
