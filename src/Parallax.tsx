import { ParentComponent, splitProps, JSX, onMount, children } from "solid-js"
import { warn, clamp } from "@solid-primitives/utils"
import { scroll } from "motion"
import { mapRange } from "./utils"

const localPropNames = ["z", "ref", "centerToScreen"] as const

export const Parallax: ParentComponent<
  JSX.IntrinsicElements["div"] & {
    z: number
    centerToScreen?: boolean
  }
> = (props) => {
  const { z, centerToScreen = false } = props

  const resolved = children(() => props.children)

  onMount(() => {
    let _ref = resolved()
    let ref!: HTMLElement

    while (_ref instanceof HTMLElement && !ref) {
      if (getComputedStyle(_ref).display === "contents") _ref = _ref.firstChild
      else ref = _ref
    }
    if (!ref) {
      warn("Parallax children must be a single element")
      return
    }

    const vh = window.innerHeight
    const sh = document.body.scrollHeight
    const { top, height } = parent.getBoundingClientRect()

    /** y position of the elements center */
    const center = centerToScreen ? vh / 2 : window.scrollY + top + height / 2
    /** scroll distance in each directions from the element's center in which the parallax effect is applied */
    const runway = Math.max(center, sh - center)
    const from = center - runway
    const to = center + runway

    const translateDistance = (runway / vh) * 10 * z

    const a = ref.animate(
      [
        { transform: `translateY(${-translateDistance}px)` },
        { transform: `translateY(${translateDistance}px)` },
      ],
      { duration: 1000, iterations: Infinity },
    )
    a.pause()
    a.currentTime = 500

    scroll(({ y }) => {
      requestAnimationFrame(() => {
        const current = y.current + vh / 2
        a.currentTime = clamp(mapRange(current, from, to, 0, 999), 0, 999)
      })
    })
  })

  const [, attrs] = splitProps(props, localPropNames)
  let parent!: HTMLDivElement
  return (
    <div ref={parent} {...attrs}>
      {resolved}
    </div>
  )
}
