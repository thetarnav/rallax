import { ParentComponent, onMount, children, createEffect, Accessor, createMemo } from "solid-js"
import { warn, clamp, MaybeAccessor, access, FalsyValue } from "@solid-primitives/utils"
import { useWindowScrollPosition } from "@solid-primitives/scroll"
import { useWindowSize } from "@solid-primitives/resize-observer"
import { mapRange, propAccessor } from "./utils"

declare global {
  interface Element {
    $rallaxAnimation?: Animation
  }
}

export interface ParallaxOptions {
  // TODO: cernter to screen automatically, based on if the element is above the fold
  centerToScreen?: boolean
}

const ANIMATION_OPTIONS = { duration: 1000, iterations: Infinity } as const

export function makeParallaxAnimation(
  target: Element,
  z: number,
  options: ParallaxOptions = {},
): VoidFunction {
  // stop the previous animation to read accurate rect value
  target.$rallaxAnimation?.cancel()

  const { centerToScreen = false } = options

  const vh = window.innerHeight
  const sh = document.body.scrollHeight
  const { top, height } = target.getBoundingClientRect()

  /** y position of the elements center */
  const center = centerToScreen ? vh / 2 : window.scrollY + top + height / 2
  /** scroll distance in each directions from the element's center in which the parallax effect is applied */
  const runway = Math.max(center, sh - center)
  const from = center - runway
  const to = center + runway

  const translateDistance = (runway / vh) * 10 * z

  const a = target.animate(
    [
      { transform: `translateY(${-translateDistance}px)` },
      { transform: `translateY(${translateDistance}px)` },
    ],
    ANIMATION_OPTIONS,
  )
  a.pause()
  a.currentTime = 500

  target.$rallaxAnimation = a

  const loop = () => {
    const current = window.scrollY + vh / 2
    a.currentTime = clamp(mapRange(current, from, to, 0, 999), 0, 999)
  }

  return () => requestAnimationFrame(loop)
}

export function createParallax(
  target: Accessor<Element | FalsyValue> | Element,
  z: MaybeAccessor<number>,
  options: ParallaxOptions = {},
) {
  // TODO: benchmark use of different triggers
  const scroll = useWindowScrollPosition()
  const size = useWindowSize()
  // TODO: add orientationchange trigger
  createEffect(() => {
    const targetEl = access(target)
    if (!targetEl) return
    size.width
    const updateAnimation = makeParallaxAnimation(targetEl, access(z), options)
    createEffect(() => {
      scroll.y
      updateAnimation()
    })
  })
}

export const Parallax: ParentComponent<
  ParallaxOptions & {
    z: number
    omitDisplayContents?: boolean
  }
> = (props) => {
  const { centerToScreen, omitDisplayContents } = props
  const resolved = children(() => props.children)

  onMount(() => {
    const target = createMemo(() => {
      let _ref = resolved()
      let ref!: Element

      if (omitDisplayContents)
        while (_ref instanceof Element && !ref) {
          if (getComputedStyle(_ref).display === "contents") _ref = _ref.firstChild
          else ref = _ref
        }
      else if (_ref instanceof Element) ref = _ref

      if (!ref) {
        warn("Parallax children must be a single element")
        return
      }
      return ref
    })
    createParallax(target, propAccessor(props, "z"), { centerToScreen })
  })

  return resolved
}
