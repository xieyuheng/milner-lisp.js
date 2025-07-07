import { type Value } from "../value/index.ts"

export type Neutral = Var | Ap
export type Var = { kind: "Var"; name: string }
export type Ap = { kind: "Ap"; target: Neutral; arg: Value }

export function Var(name: string): Var {
  return {
    kind: "Var",
    name,
  }
}

export function Ap(target: Neutral, arg: Value): Ap {
  return {
    kind: "Ap",
    target,
    arg,
  }
}
