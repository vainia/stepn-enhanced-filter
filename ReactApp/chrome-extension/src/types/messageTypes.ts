export type TMessageFrom = "HostSiteScript" | "ContentScript" | "ReactApp"
export type TMessageType =
  | "CheckSession"
  | "StartSearch"
  | "StopSearch"
  | "SearchResultUpdate"

export type TSearchResultUpdate = {
  checkedSneakersCount: number
  currentSneakerSellPrice: string
  foundSneakersCount: number
}
