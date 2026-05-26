import { cp, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const toPath = url => fileURLToPath(url)
const distDir = new URL('../dist/', import.meta.url)

const copyTargets = [
  { from: new URL('../example/index.html', import.meta.url), to: new URL('../dist/index.html', import.meta.url) },
  { from: new URL('../example/global.css', import.meta.url), to: new URL('../dist/global.css', import.meta.url) },
  { from: new URL('../example/src', import.meta.url), to: new URL('../dist/src', import.meta.url), recursive: true },
]

await mkdir(toPath(distDir), { recursive: true })

for (const target of copyTargets) {
  await cp(toPath(target.from), toPath(target.to), { force: true, recursive: target.recursive === true })
}
