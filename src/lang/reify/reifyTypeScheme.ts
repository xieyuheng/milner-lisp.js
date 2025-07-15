import {
  emptySubst,
  substDeepWalk,
  substLength,
  substUpdate,
  type Subst,
} from "../subst/index.ts"
import * as Types from "../type/index.ts"
import { type TypeScheme } from "../type/index.ts"

export function reifyTypeScheme(typeScheme: TypeScheme): TypeScheme {
  if (typeScheme.kind !== "Nu") return typeScheme

  const renamingSubst = prepareSubst(typeScheme.names)

  return Types.Nu(
    prepareNewNames(typeScheme.names),
    substDeepWalk(renamingSubst, typeScheme.type),
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
