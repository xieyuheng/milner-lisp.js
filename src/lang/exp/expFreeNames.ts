import { type Exp } from "./index.ts"

export function expFreeNames(boundNames: Set<string>, exp: Exp): Set<string> {
  switch (exp.kind) {
    case "Var": {
      return boundNames.has(exp.name) ? new Set() : new Set([exp.name])
    }

    case "Lambda": {
      return expFreeNames(new Set([...boundNames, exp.name]), exp.ret)
    }

    case "Apply": {
      return new Set([
        ...expFreeNames(boundNames, exp.target),
        ...expFreeNames(boundNames, exp.arg),
      ])
    }

    case "Let": {
      return new Set([
        ...expFreeNames(boundNames, exp.rhs),
        ...expFreeNames(new Set([...boundNames, exp.name]), exp.body),
      ])
    }
  }
}
