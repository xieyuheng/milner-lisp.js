import { envExtend } from "../env/Env.ts"
import { evaluate } from "../evaluate/index.ts"
import * as Neutrals from "../neutral/index.ts"
import * as Values from "../value/index.ts"
import { type Value } from "../value/index.ts"

export function apply(target: Value, arg: Value): Value {
  switch (target.kind) {
    case "Fn": {
      return evaluate(
        target.mod,
        envExtend(target.env, target.name, arg),
        target.ret,
      )
    }

    case "NotYet": {
      return Values.NotYet(Neutrals.Ap(target.neutral, arg))
    }
  }
}
