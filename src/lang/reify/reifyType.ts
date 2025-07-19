import {
  emptySubst,
  substDeepWalk,
  substLength,
  substUpdate,
  type Subst,
} from "../infer/index.ts"
import * as Types from "../type/index.ts"
import { type Type } from "../type/index.ts"

export function reifyType(type: Type): Type {
  if (type.kind !== "Nu") return type

  const renamingSubst = prepareSubst(type.names)

  return Types.Nu(
    prepareNewNames(type.names),
    substDeepWalk(renamingSubst, type.type),
  )
}

function prepareSubst(names: Array<string>): Subst {
  let subst = emptySubst()
  for (const name of names) {
    const newName = numberToReadableName(substLength(subst))
    subst = substUpdate(subst, name, Types.TypeVar(newName))
  }

  return subst
}

function prepareNewNames(names: Array<string>): Array<string> {
  const newNames = []
  for (const _ of names) {
    newNames.push(numberToReadableName(newNames.length))
  }

  return newNames
}

function numberToReadableName(n: number): string {
  const length = englishAlphabets.length
  const p = Math.floor(n / length)
  if (p === 0) {
    return `${numberToEnglishAlphabet(n % length)}`
  } else {
    return `${numberToEnglishAlphabet(n % length)}${p}`
  }
}

function numberToEnglishAlphabet(n: number): string {
  return englishAlphabets[n]
}

const englishAlphabets = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
]
