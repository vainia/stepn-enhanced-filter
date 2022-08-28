import { useState } from "react"
import Bookmark from "../../components/BookmarkComp"
import { getStoredData } from "../../services/chromeStorageService"

interface IBookmark {
  identifier: string
  name: string
}

const SavedFiltersSectionComp = () => {
  const [bookmarks, setBookmarks] = useState<IBookmark[]>([])

  if (!bookmarks.length) {
    getStoredData<IBookmark[]>("BookmarkedSneakers").then(setBookmarks)

    return <div className="row">No saved sneakers to show</div>
  }

  return (
    <>
      {bookmarks.map((bookmark) => (
        <Bookmark
          key={bookmark.identifier}
          identifier={bookmark.identifier}
          name={bookmark.name}
          callbackOnDelete={setBookmarks}
        />
      ))}
    </>
  )
}

export default SavedFiltersSectionComp
