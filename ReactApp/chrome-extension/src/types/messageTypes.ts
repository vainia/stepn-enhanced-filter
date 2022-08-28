export type TMessageFrom = "HostSiteScript" | "ContentScript" | "ReactApp"
export type TMessageType =
  | "StartIntercepting"
  | "CheckSession"
  | "StartSearch"
  | "StopSearch"
  | "SearchResultUpdate"

export type TSearchResultUpdate = {
  checkedSneakersCount: number
  currentSneakerSellPrice: string
  foundSneakersCount: number
}
