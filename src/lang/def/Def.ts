import { type Exp } from "../exp/index.ts"
import { type Mod } from "../mod/index.ts"
import { type Type } from "../type/index.ts"
import { type Value } from "../value/index.ts"

export type Def = {
  mod: Mod
  name: string
  exp: Exp
  freeNames: Set<string>
  type?: Type
  cache?: Value
}
