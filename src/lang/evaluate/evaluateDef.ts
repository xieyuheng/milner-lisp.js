import { type Def } from "../def/index.ts"
import { envEmpty } from "../env/index.ts"
import { evaluate } from "../evaluate/index.ts"
import { type Value } from "../value/index.ts"

export function evaluateDef(def: Def): Value {
  if (def.value !== undefined) {
    return def.value
  }

  return (def.value = evaluate(def.mod, envEmpty(), def.exp))
}
