import { onMount, children, createEffect, Accessor, createMemo, onCleanup, JSX } from "solid-js"
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

  // TODO: "z" should mean something measurable
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
    // setting the time to 1000 will "finish" the animation, reseting the transform
    a.currentTime = clamp(mapRange(current, from, to, 0, 999), 0, 999)
  }

  let rafId: number | undefined
  onCleanup(() => {
    rafId && cancelAnimationFrame(rafId)
    a.cancel()
  })
  return () => (rafId = requestAnimationFrame(loop))
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

export function Parallax(
  props: ParallaxOptions & {
    z: number
    omitDisplayContents?: boolean
    children: JSX.Element
  },
) {
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

export function BackgroundParallax(props: {
  z: number
  children: JSX.Element
  omitDisplayContents?: boolean
}) {
  const { omitDisplayContents } = props
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

    const scroll = useWindowScrollPosition()

    createEffect(() => {
      const el = target()
      if (!el) return

      const { top: elTop, height: elH } = el.getBoundingClientRect()
      const vh = window.innerHeight

      // const runwayHeight = Math.min(elH + vh, sh - vh)
      const runwayHeight = elH + vh
      // const from = Math.max(window.scrollY + elTop - vh, 0)
      const from = window.scrollY + elTop - vh
      const to = from + runwayHeight
      const scale = 1.05 ** props.z
      const distance = (elH * scale - elH) / 2

      const a = el.animate(
        [
          { transform: `translateY(${-distance}px) scale(${scale})` },
          { transform: `translateY(${distance}px) scale(${scale})` },
        ],
        ANIMATION_OPTIONS,
      )
      a.pause()
      a.currentTime = 500
      el.$rallaxAnimation = a

      let progress: number
      let rafId: number | undefined

      onCleanup(() => {
        rafId && cancelAnimationFrame(rafId)
        a.cancel()
      })

      const loop = () => (a.currentTime = progress)

      createEffect(() => {
        // setting the time to 1000 will "finish" the animation, reseting the transform
        progress = mapRange(scroll.y, from, to, 0, 999)
        if (progress > 999 || progress < 0) return
        rafId = requestAnimationFrame(loop)
      })
    })
  })

  return resolved
}
