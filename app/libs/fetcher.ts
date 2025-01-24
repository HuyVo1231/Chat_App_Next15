export async function fetcher(url: string, options: RequestInit) {
  const res = await fetch(url, options)

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData?.message || 'Something went wrong')
  }

  return res.json()
}
