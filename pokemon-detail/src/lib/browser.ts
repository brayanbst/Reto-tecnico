export function getSearchParam(name: string) {
  return new URLSearchParams(globalThis.location.search).get(name)
}

export function navigateTo(url: string) {
  globalThis.location.assign(url)
}

