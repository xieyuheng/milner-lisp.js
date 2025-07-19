import type { Def, Mod } from "./Mod.ts"

export function modFind(mod: Mod, name: string): Def | undefined {
  return mod.defs.get(name)
}
