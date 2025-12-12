import VectorPresentation from "@/components/presentation"
import { NuqsAdapter } from "nuqs/adapters/next/app"
import { Suspense } from "react"

export default function Home() {
  return (
    <NuqsAdapter>
      <Suspense>
        <VectorPresentation />
      </Suspense>
    </NuqsAdapter>
  )
}
