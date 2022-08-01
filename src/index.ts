import { onMount, children, createEffect, Accessor, onCleanup, JSX } from "solid-js"
import { clamp, MaybeAccessor, access, FalsyValue } from "@solid-primitives/utils"
import { useWindowScrollPosition } from "@solid-primitives/scroll"
import { useWindowSize } from "@solid-primitives/resize-observer"
import { createSingleChild, mapRange, propAccessor } from "./utils"

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

export function makeAnimation(
  target: Element,
  keyframes: MaybeAccessor<Keyframe[] | PropertyIndexedKeyframes | null>,
): (currentTime: number) => void {
  // stop the previous animation to read accurate rect value
  target.$rallaxAnimation?.cancel()
  const animation = target.animate(access(keyframes), ANIMATION_OPTIONS)
  animation.pause()
  animation.currentTime = 500
  target.$rallaxAnimation = animation
  let rafId: number | undefined
  let currentTime: number
  onCleanup(() => {
    animation.cancel()
    rafId && cancelAnimationFrame(rafId)
  })
  const frame = () => {
    animation.currentTime = currentTime
    rafId = undefined
  }
  return (time) => {
    currentTime = time
    if (rafId === undefined) rafId = requestAnimationFrame(frame)
  }
}

export function makeParallaxAnimation(
  target: Element,
  z: number,
  options: ParallaxOptions = {},
): VoidFunction {
  const { centerToScreen = false } = options
  const vh = window.innerHeight
  const sh = document.body.scrollHeight

  let from: number
  let to: number

  const updateAnimation = makeAnimation(target, () => {
    const { top, height } = target.getBoundingClientRect()

    /** y position of the elements center */
    const center = centerToScreen ? vh / 2 : window.scrollY + top + height / 2
    /** scroll distance in each directions from the element's center in which the parallax effect is applied */
    const runway = Math.max(center, sh - center)

    from = center - runway
    to = center + runway

    // TODO: "z" should mean something measurable
    const translateDistance = (runway / vh) * 10 * z

    return [
      { transform: `translateY(${-translateDistance}px)` },
      { transform: `translateY(${translateDistance}px)` },
    ]
  })

  return () => {
    const current = window.scrollY + vh / 2
    // setting the time to 1000 will "finish" the animation, reseting the transform
    updateAnimation(clamp(mapRange(current, from, to, 0, 999), 0, 999))
  }
}

export function makeBackgroundParallaxAnimation(target: Element, z: number) {
  const vh = window.innerHeight
  let from: number
  let to: number

  const updateAnimation = makeAnimation(target, () => {
    const { top: elTop, height: elH } = target.getBoundingClientRect()
    from = window.scrollY + elTop - vh
    to = from + elH + vh
    const scale = 1.05 ** z
    const distance = (elH * scale - elH) / 2

    return [
      { transform: `translateY(${-distance}px) scale(${scale})` },
      { transform: `translateY(${distance}px) scale(${scale})` },
    ]
  })

  return () => {
    // setting the time to 1000 will "finish" the animation, reseting the transform
    const progress = mapRange(window.scrollY, from, to, 0, 999)
    if (progress <= 999 && progress >= 0) updateAnimation(progress)
  }
}

export function createParallax(
  target: Accessor<Element | FalsyValue> | Element,
  z: MaybeAccessor<number>,
  animationFactory: typeof makeParallaxAnimation | typeof makeBackgroundParallaxAnimation,
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
    const updateAnimation = animationFactory(targetEl, access(z), options)
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
    const target = createSingleChild(resolved, { omitDisplayContents })
    createParallax(target, propAccessor(props, "z"), makeParallaxAnimation, { centerToScreen })
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
    const target = createSingleChild(resolved, { omitDisplayContents })
    createParallax(target, propAccessor(props, "z"), makeBackgroundParallaxAnimation)
  })

  return resolved
}
