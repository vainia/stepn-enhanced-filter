import { persistentStorageKey } from "../redux/store"

export const readPersistentStorageValue = <T>(key: string) => {
  const storageData = localStorage.getItem(persistentStorageKey)
  if (!storageData) return null
  const parsedData = JSON.parse(storageData)
  return parsedData[key] as T
}
