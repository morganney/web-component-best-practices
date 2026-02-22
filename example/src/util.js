export const getBaseUrl = value => {
  const url = value instanceof URL ? value : new URL(value)
  const directory = url.pathname.substring(0, url.pathname.lastIndexOf('/'))

  return `${url.origin}${directory}`
}

export const fetchText = async (url, label) => {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(
      `Failed to load ${label} (${response.status} ${response.statusText}) from ${url}`,
    )
  }

  return response.text()
}
