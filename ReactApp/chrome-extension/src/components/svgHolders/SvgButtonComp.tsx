import { IconButton, SxProps, Theme } from "@mui/material"

type TSvgButtonProps = {
  onButtonClick: (event?: any) => void
  buttonClassName?: string
  buttonSx?: SxProps<Theme>
} & React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>

const SvgButtonComp = ({
  onButtonClick,
  buttonClassName,
  buttonSx,
  ...imageProps
}: TSvgButtonProps) => {
  return (
    <IconButton
      onClick={onButtonClick}
      className={buttonClassName}
      sx={buttonSx}
    >
      <img
        {...imageProps}
        alt={imageProps.alt}
        height={imageProps.height || 50}
        width={imageProps.width || 50}
      />
    </IconButton>
  )
}

export default SvgButtonComp
