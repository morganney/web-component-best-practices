const SAFE_TAG_RE = /^[a-z][a-z0-9._-]*-[a-z0-9._-]*$/

export const escapeHtml = value =>
  String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')

export const normalizeTag = name => {
  const tagName = String(name).toLowerCase().trim()

  if (!SAFE_TAG_RE.test(tagName)) {
    throw new Error(`Invalid custom element tag "${name}". Must include a hyphen, e.g. "card-fragment".`)
  }

  return tagName
}
