import { envFind, envUpdate, type Env } from "../env/index.ts"
import { type Exp } from "../exp/index.ts"
import { modFindValue, type Mod } from "../mod/index.ts"
import * as Neutrals from "../value/index.ts"
import * as Values from "../value/index.ts"
import { type Value } from "../value/index.ts"

export function evaluate(mod: Mod, env: Env, exp: Exp): Value {
  switch (exp.kind) {
    case "Var": {
      let value = undefined

      value = envFind(env, exp.name)
      if (value !== undefined) return value

      value = modFindValue(mod, exp.name)
      if (value !== undefined) return value

      throw new Error(`Unknown name: ${exp.name}`)
    }

    case "Lambda": {
      return Values.Lambda(mod, env, exp.name, exp.ret)
    }

    case "Apply": {
      const target = evaluate(mod, env, exp.target)
      const arg = evaluate(mod, env, exp.arg)
      return apply(target, arg)
    }

    case "Let": {
      return evaluate(
        mod,
        envUpdate(env, exp.name, evaluate(mod, env, exp.rhs)),
        exp.body,
      )
    }
  }
}

export function apply(target: Value, arg: Value): Value {
  switch (target.kind) {
    case "Lambda": {
      return evaluate(
        target.mod,
        envUpdate(target.env, target.name, arg),
        target.ret,
      )
    }

    case "NotYet": {
      return Values.NotYet(Neutrals.Apply(target.neutral, arg))
    }
  }
}
