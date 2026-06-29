import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <main className="min-h-viewport-content flex flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-semibold tracking-[-0.03em]">
        Stackd Platform | Creators
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Creator portal — coming soon.
      </p>
    </main>
  )
}
