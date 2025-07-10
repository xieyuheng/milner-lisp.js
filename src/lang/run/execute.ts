import { envEmpty } from "../env/index.ts"
import { evaluate } from "../evaluate/index.ts"
import { formatExp } from "../format/formatExp.ts"
import type { Mod } from "../mod/Mod.ts"
import { readback, ReadbackCtx } from "../readback/index.ts"
import type { Stmt } from "../stmt/Stmt.ts"

export function execute(mod: Mod, stmt: Stmt): null {
  switch (stmt.kind) {
    case "Compute": {
      const value = evaluate(mod, envEmpty(), stmt.exp)
      const exp = readback(ReadbackCtx.init(), value)
      console.log(formatExp(exp))
      return null
    }

    default: {
      return null
    }
  }
}
