interface IBookmarkProps {
  key: string
  identifier: string
  name: string
  callbackOnDelete: (bookmarks: []) => void
}

const Bookmark = ({ identifier, name, callbackOnDelete }: IBookmarkProps) => {
  const onDelete = () => {}
  // sendMessageToCurrentTab({ type: "DeleteBookmark" }, callbackOnDelete)
  const onActivate = () => {}
  //sendMessageToCurrentTab({ type: "ActivateBookmark" })

  return (
    <div key={identifier} className="bookmark">
      <div className="bookmark--title">{name}</div>
      <div className="bookmark--controls">
        <img
          src="assets/activate.png"
          alt="Activate"
          title="Activate"
          onClick={onActivate}
        />
        <img
          src="assets/delete.png"
          alt="Delete"
          title="Delete"
          onClick={onDelete}
        />
      </div>
    </div>
  )
}

export default Bookmark
