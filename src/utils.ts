export const mapRange = (
  value: number,
  in_min: number,
  in_max: number,
  out_min: number,
  out_max: number,
) => ((value - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min

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
