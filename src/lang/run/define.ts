import { emptyEnv } from "../env/index.ts"
import { evaluate } from "../evaluate/index.ts"
import { formatTypeScheme } from "../format/index.ts"
import { inferTypeScheme } from "../infer/index.ts"
import type { Mod } from "../mod/index.ts"
import { modDefine, modFind, modResolve, modToCtx } from "../mod/index.ts"
import type { ImportEntry, Stmt } from "../stmt/index.ts"
import { run } from "./run.ts"

export function define(mod: Mod, stmt: Stmt): null {
  switch (stmt.kind) {
    case "Define": {
      const ctx = modToCtx(mod)
      const typeScheme = inferTypeScheme(ctx, stmt.exp)
      console.log(`(claim ${stmt.name} ${formatTypeScheme(typeScheme)})`)
      const value = evaluate(mod, emptyEnv(), stmt.exp)
      modDefine(mod, stmt.name, {
        mod,
        name: stmt.name,
        exp: stmt.exp,
        value,
        typeScheme,
      })

      return null
    }

    case "Import": {
      for (const entry of stmt.entries) {
        importOne(mod, stmt.path, entry)
      }

      return null
    }

    default: {
      return null
    }
  }
}

function importOne(mod: Mod, path: string, entry: ImportEntry): void {
  const url = modResolve(mod, path)
  if (url.href === mod.url.href) {
    throw new Error(`I can not circular import: ${path}`)
  }

  const found = mod.loadedMods.get(url.href)
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
