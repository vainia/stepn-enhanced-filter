import { Icon } from "@mui/material"

type TSvgIconProps = {
    selected?: boolean
} & React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>

const SvgIconComp = ({ selected, ...imageProps }: TSvgIconProps) => {
    const selectedImageStyles = selected ? {
        filter: "drop-shadow(0px 0px 5px rgb(0 0 0 / 0.2))",
        zIndex: "1"
    } : {}

    return (<Icon sx={{
        height: imageProps.height,
        width: imageProps.width,
        position: "relative",
    }}>
        <img style={{
            position: "absolute",
            display: "flex",
            ...selectedImageStyles
        }} {...imageProps} alt={imageProps.alt} />
        {selected && <div style={{
            content: "",
            position: "absolute",
            bottom: "0",
            left: "0",
            right: "0",
            zIndex: "0",
        }}></div>}
    </Icon>)
}

export default SvgIconComp