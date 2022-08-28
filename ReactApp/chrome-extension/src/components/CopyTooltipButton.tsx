import { ContentCopy } from "@mui/icons-material"
import { Button } from "@mui/joy"
import { ClickAwayListener, Tooltip } from "@mui/material"
import { useState } from "react"
import { timeout } from "../utils/kronosUtils"

export type TCopyTooltipButton = {
  label: string
  textToCopy: string
  tooltipText: string
}

const CopyTooltipButton = ({
  label,
  textToCopy,
  tooltipText,
}: TCopyTooltipButton) => {
  const [tooltipOpen, setTooltipOpen] = useState(false)

  return (
    <ClickAwayListener onClickAway={() => setTooltipOpen(false)}>
      <div>
        <Tooltip
          PopperProps={{
            disablePortal: true,
          }}
          onClose={() => setTooltipOpen(false)}
          open={tooltipOpen}
          disableFocusListener
          disableHoverListener
          disableTouchListener
          title={tooltipText}
          placement="top"
          arrow
        >
          <Button
            size="md"
            variant="soft"
            endIcon={<ContentCopy />}
            onClick={() => {
              setTooltipOpen(true)
              timeout(1500).then(() => {
                setTooltipOpen(false)
              })
              navigator.clipboard.writeText(textToCopy)
            }}
          >
            {label}
          </Button>
        </Tooltip>
      </div>
    </ClickAwayListener>
  )
}

export default CopyTooltipButton
