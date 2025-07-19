import { freshen } from "../../utils/name/freshen.ts"
import { apply } from "../evaluate/index.ts"
import * as Exps from "../exp/index.ts"
import { type Exp } from "../exp/index.ts"
import { type Ctx, ctxUseName } from "./Ctx.ts"
import * as Neutrals from "../value/index.ts"
import * as Values from "../value/index.ts"
import { type Neutral, type Value } from "../value/index.ts"

export function readback(ctx: Ctx, value: Value): Exp {
  switch (value.kind) {
    case "NotYet": {
      return readbackNeutral(ctx, value.neutral)
    }

    case "Lambda": {
      const freshName = freshen(ctx.usedNames, value.name)
      ctx = ctxUseName(ctx, freshName)
      const arg = Values.NotYet(Neutrals.Var(freshName))
      const ret = apply(value, arg)
      return Exps.Lambda(freshName, readback(ctx, ret))
    }
  }
}

function readbackNeutral(ctx: Ctx, neutral: Neutral): Exp {
  switch (neutral.kind) {
    case "Var": {
      return Exps.Var(neutral.name)
    }

    case "Apply": {
      return Exps.Apply(
        readbackNeutral(ctx, neutral.target),
        readback(ctx, neutral.arg),
      )
    }
  }
}
