import { mkdir, writeFile } from "node:fs/promises"
import { resolve } from "node:path"

const outputDir = resolve(process.cwd(), "data")
const outputFile = resolve(outputDir, "jotform-data.json")

async function main() {
  const { fetchInvestigationForms } = await import("../api/jotform.ts")

  const data = await fetchInvestigationForms()

  await mkdir(outputDir, { recursive: true })
  await writeFile(outputFile, JSON.stringify(data, null, 2), "utf-8")

  console.log(`Wrote data to ${outputFile}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
