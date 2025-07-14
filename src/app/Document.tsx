const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  try {
    return children
  } catch (e) {
    if (e instanceof Error) {
      return <div>Error: {e.message}</div>
    }

    if (typeof e === "string") {
      return <div>Error: {e} </div>
    }

    return <div>Error: {JSON.stringify(e)}</div>
  }
}

export const Document = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>@redwoodjs/starter-standard</title>
        <link rel="modulepreload" href="/src/client.tsx" />
      </head>
      <body>
        {/** biome-ignore lint/nursery/useUniqueElementIds: Must be "root" */}
        <div id="root">
          <ErrorBoundary>{children}</ErrorBoundary>
        </div>
        <script>import("/src/client.tsx")</script>
      </body>
    </html>
  )
}
