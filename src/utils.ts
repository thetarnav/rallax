import { MaybeAccessor } from "@solid-primitives/utils"
import { Accessor, createMemo } from "solid-js"
import type { ResolvedChildren } from "solid-js/types/reactive/signal"

export const mapRange = (
  value: number,
  in_min: number,
  in_max: number,
  out_min: number,
  out_max: number,
) => ((value - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min

export const pToVal = (p: number, zero: number, hundred: number): number =>
  p * (hundred - zero) + zero

// TODO: contribute to @solid-primitives/utils
export function propAccessor<K extends string, Props extends { [Key in K]: unknown }>(
  object: Props,
  key: K,
): MaybeAccessor<Props[K]> {
  const d = Object.getOwnPropertyDescriptor(object, key)
  if (!d) return object[key]
  return d.get ?? d.value
}

// TODO: contribute to @solid-primitives/refs
export function createSingleChild(
  resolved: Accessor<ResolvedChildren>,
  options: { omitDisplayContents?: boolean } = {},
): Accessor<Element | undefined> {
  const { omitDisplayContents } = options
  return createMemo(() => {
    let _ref = resolved()
    let ref!: Element

    if (omitDisplayContents)
      while (_ref instanceof Element && !ref) {
        if (getComputedStyle(_ref).display === "contents") _ref = _ref.firstChild
        else ref = _ref
      }
    else if (_ref instanceof Element) ref = _ref

    return ref
  })
}

// const randomColor = () => {
// 	const r = Math.floor(Math.random() * 256)
// 	const g = Math.floor(Math.random() * 256)
// 	const b = Math.floor(Math.random() * 256)
// 	return `rgb(${r}, ${g}, ${b})`
// }

// const createWorldGuide = (y: number) => {
// 	;<Portal>
// 		<div
// 			class="absolute inset-x-0 z-[99999] h-px"
// 			style={{ top: `${y}px`, background: randomColor() }}
// 		/>
// 	</Portal>
// }
