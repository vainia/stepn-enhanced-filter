export const getStoredData = <TData>(keys: string) =>
  new Promise<TData>((resolve, reject) => {
    resolve([
      {
        identifier: "idTest",
        name: "Test bookmark",
      },
    ] as any)
    chrome.storage.sync.get([keys], (data) => {
      const currentBookmarks = data[keys] ? JSON.parse(data[keys]) : []
      resolve(currentBookmarks)
    })
  })
