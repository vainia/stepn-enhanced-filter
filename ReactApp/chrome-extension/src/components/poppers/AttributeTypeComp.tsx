import { Typography } from "@mui/joy"
import { useEffect, useState } from "react"
import {
  attributeTypes,
  getAttributeIconUrl,
  TAttribute,
} from "../../services/stepnAttributesService"
import IconWithPopperComp from "../IconWithPopperComp"
import SvgIconComp from "../svgHolders/SvgIconComp"

type TAttributeTypeProps = {
  id: number
  attributeType: TAttribute
  availableTypes?: TAttribute[]
  button?: {
    sx?: React.CSSProperties
    width?: string
    height?: string
  }
  onTypeChange?: (id: number, newType: TAttribute) => void
}

const AttributeTypeComp = ({
  id,
  attributeType,
  button,
  onTypeChange,
  availableTypes,
}: TAttributeTypeProps) => {
  const [type, setType] = useState(attributeType)
  const alt = "Attribute Type"

  useEffect(() => {
    onTypeChange && onTypeChange(id, type)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const types = availableTypes ? availableTypes : attributeTypes

  return (
    <IconWithPopperComp
      button={{
        sx: button?.sx as any,
        width: button?.width,
        height: button?.height,
      }}
      popperSx={{ width: "auto" }}
      alt={alt}
      iconSrc={getAttributeIconUrl(type)}
      PopperContent={() => (
        <>
          <Typography>
            {types.length > 0 ? "Type" : "No types available"}
          </Typography>
          {types.map((at) => (
            <SvgIconComp
              key={at}
              src={getAttributeIconUrl(at)}
              alt={alt}
              height={35}
              width={35}
              selected={type === at}
              onClick={() => {
                onTypeChange && onTypeChange(id, at)
                setType(at)
              }}
            />
          ))}
        </>
      )}
    />
  )
}

export default AttributeTypeComp
