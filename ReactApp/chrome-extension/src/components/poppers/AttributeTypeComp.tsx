import { Typography } from "@mui/joy"
import { useState } from "react"
import { attributeFilterSlice } from "../../redux/reducers/attributesFilterReducer"
import { useAppDispatch } from "../../redux/store"
import {
  attributeTypes,
  getAttributeIconUrl,
  TAttribute,
} from "../../services/stepnAttributesService"
import IconWithPopperComp from "../IconWithPopperComp"
import SvgIconComp from "../svgHolders/SvgIconComp"

type TAttributeTypeProps = {
  usedBy: number
  attributeType: TAttribute
  availableTypes?: TAttribute[]
  button?: {
    sx?: React.CSSProperties
    width?: string
    height?: string
  }
}

const AttributeTypeComp = ({
  usedBy,
  attributeType,
  button,
  availableTypes,
}: TAttributeTypeProps) => {
  const dispatch = useAppDispatch()

  const [type, setType] = useState(attributeType)
  const alt = "Attribute Type"

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
                dispatch(
                  attributeFilterSlice.actions.replaceUsedTypeByFilterId({
                    usedBy,
                    newType: at,
                  })
                )
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
