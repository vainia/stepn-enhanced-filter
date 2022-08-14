import { Sheet, Theme } from "@mui/joy"
import { Popper, ClickAwayListener, SxProps } from "@mui/material"
import { useState } from "react"
import SvgButtonComp from "./svgHolders/SvgButtonComp"

type TIconWithPopperComp = {
  button?: {
    className?: string
    sx?: SxProps<Theme>
    width?: string
    height?: string
  }
  popperSx?: SxProps<Theme>
  iconSrc: string
  alt: string
  PopperContent: () => JSX.Element
}

const IconWithPopperComp = ({
  button,
  iconSrc,
  alt,
  PopperContent,
  popperSx,
}: TIconWithPopperComp) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div>
      <SvgButtonComp
        buttonClassName={button?.className}
        buttonSx={button?.sx as any}
        src={iconSrc}
        alt={alt}
        onButtonClick={handleClick}
        width={button?.width}
        height={button?.height}
      />
      <Popper open={open} anchorEl={anchorEl}>
        <ClickAwayListener onClickAway={handleClose}>
          <Sheet
            variant="outlined"
            color="neutral"
            sx={{
              width: "250px",
              p: 2,
              boxShadow: "md",
              cursor: "pointer",
              borderRadius: "md",
              ...popperSx,
            }}
          >
            <PopperContent />
          </Sheet>
        </ClickAwayListener>
      </Popper>
    </div>
  )
}

export default IconWithPopperComp
