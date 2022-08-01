import { Component } from "solid-js"
import { createParallax, Parallax, BackgroundParallax } from "../src"

const App: Component = () => {
  return (
    <div class="bg-dark color-light font-thin">
      <main class="min-h-screen px-12 py-32">
        <header class="mb-10">
          <h1 class="text-4rem">
            Welcome to the{" "}
            <span class="color-cyan-500 font-bold">
              rallax {/* <Parallax z={-100} centerToScreen> */}
              <span
                class="inline-block"
                ref={(el) => {
                  createParallax(el, -100, {
                    centerToScreen: true,
                  })
                }}
              >
                <svg viewBox="0 0 24 24" class="w-12 inline rotate-30 -translate-y-4 translate-x-1">
                  <path
                    d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              {/* </Parallax> */}
            </span>{" "}
            playground!
          </h1>
        </header>
        <div class="relative">
          {/* <Parallax z={50} centerToScreen> */}
          <img
            ref={(el) => {
              createParallax(el, 50, { centerToScreen: true })
            }}
            src="https://images.unsplash.com/photo-1536903978057-65e5fcece404?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1440&q=50"
            class="absolute inset-x-0 opacity-40"
          />
          {/* </Parallax> */}
          <div class="relative z-1 pt-10 overflow-hidden">
            <div class="-mx-2px text-8 leading-[1.4] space-y-8">
              <p>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Numquam voluptatem
                voluptates suscipit et atque nam ea, eligendi cum, aperiam quis quidem laudantium
                excepturi eius id iure. Excepturi quaerat facere corrupti! Nulla maiores distinctio,
                odio officiis eaque quibusdam quam esse ad dolores illo necessitatibus cumque
                doloremque ipsa nostrum beatae error! Aliquam commodi odio necessitatibus dolorem
                animi voluptates accusamus, quia eos cupiditate! Placeat exercitationem dolor nobis
                dolorum vitae quaerat, voluptatibus deserunt odio facere ullam laborum dignissimos
                non quisquam voluptatem voluptas illum aperiam architecto modi rem, incidunt aliquam
                ab eum doloremque. Velit, laboriosam? Adipisci non minus rem voluptatibus vero ea
                molestiae fugiat saepe maiores expedita. Expedita impedit hic eos inventore.
              </p>
              <div class="relative aspect-video overflow-hidden">
                <BackgroundParallax z={8}>
                  <img
                    class="absolute inset-0 h-full w-full object-cover"
                    src="https://images.unsplash.com/photo-1535957641083-17134361b629?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1440&q=50"
                  />
                </BackgroundParallax>
              </div>
              <p>
                Tempore sunt consequatur deleniti ratione, placeat corporis nulla, blanditiis quam
                asperiores laboriosam dolorum? Voluptate dolores eligendi eos consectetur quisquam
                odio harum et eum iure expedita velit, porro sapiente maiores, quod dolorem deserunt
                minus earum dicta aut corporis. Voluptate laborum excepturi distinctio qui est. Ut
                reprehenderit accusamus facilis consectetur tempore maxime similique obcaecati?
                Deleniti accusantium sed fugit ipsa tempora. Magnam minus doloribus accusantium.
                Libero nesciunt, itaque amet ab expedita assumenda minima eligendi alias quisquam!
                Ratione repellat hic libero recusandae a? Ipsum temporibus recusandae ab nisi
                perspiciatis, maxime eligendi! Eaque facere corporis libero vitae nam inventore!
                Omnis cum iusto libero deleniti eligendi quidem quae distinctio? Fuga veniam culpa,
                minima ut iusto fugiat autem sed mollitia. Neque ipsa praesentium iure.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
