import { emptyEnv } from "../env/index.ts"
import { evaluate } from "../evaluate/index.ts"
import { formatType } from "../format/index.ts"
import { ctxFromMod } from "../infer/ctxFromMod.ts"
import { infer } from "../infer/index.ts"
import type { Mod } from "../mod/index.ts"
import { modDefine, modFind, modResolve } from "../mod/index.ts"
import type { ImportEntry, Stmt } from "../stmt/index.ts"
import { globalLoadedMods } from "./globalLoadedMods.ts"
import { run } from "./run.ts"

export function define(mod: Mod, stmt: Stmt): void {
  if (stmt.kind === "Define") {
    const ctx = ctxFromMod(mod)
    const type = infer(ctx, stmt.exp)
    console.log(`(claim ${stmt.name} ${formatType(type)})`)
    const value = evaluate(mod, emptyEnv(), stmt.exp)
    modDefine(mod, stmt.name, {
      mod,
      name: stmt.name,
      exp: stmt.exp,
      value,
      type: type,
    })

    return
  }

  if (stmt.kind === "Import") {
    for (const entry of stmt.entries) {
      importOne(mod, stmt.path, entry)
    }

    return
  }
}

function importOne(mod: Mod, path: string, entry: ImportEntry): void {
  const url = modResolve(mod, path)
  if (url.href === mod.url.href) {
    throw new Error(`I can not circular import: ${path}`)
  }

  const found = globalLoadedMods.get(url.href)
  if (found === undefined) {
    throw new Error(`Mod is not loaded: ${path}`)
  }

  run(found.mod)

  const { name, rename } = entry

  const def = modFind(found.mod, name)
  if (def === undefined) {
    throw new Error(
      `I can not import undefined name: ${name}, from path: ${path}`,
    )
  }

  modDefine(mod, rename || name, def)
}
