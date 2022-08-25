import { Typography } from "@mui/joy"
import { Divider } from "@mui/material"
import { useState } from "react"
import { socketFilterSlice } from "../../redux/reducers/socketFilterReducer"
import { useAppDispatch } from "../../redux/store"
import {
  attributeTypes,
  getAttributeIconUrl,
  getAttributeTypeForGemType,
} from "../../services/stepnAttributesService"
import {
  EGemQuality,
  EGemType,
  gemQualities,
  getGemIconUrl,
  getGemTypeFromAttribute,
} from "../../services/stepnGemService"
import IconWithPopperComp from "../IconWithPopperComp"
import SvgIconComp from "../svgHolders/SvgIconComp"

type TGemSocketProps = {
  index: number
  gemType: EGemType
  gemLevel: EGemQuality
}

const GemSocketComp = ({ index, gemType, gemLevel }: TGemSocketProps) => {
  const [type, setType] = useState(gemType)
  const [level, setLevel] = useState(gemLevel)

  const dispatch = useAppDispatch()

  return (
    <IconWithPopperComp
      alt="Gem Socket"
      iconSrc={getGemIconUrl(type, level)}
      button={{
        sx: {
          "&.unlocked::after": {
            content: "'+'",
            color: "white",
            position: "absolute",
            display: "block",
            fontSize: "larger",
          },
        },
        className: `${level > 0 ? "unlocked" : ""}`,
      }}
      PopperContent={() => (
        <>
          <Typography>Type</Typography>
          {attributeTypes.map((at) => (
            <SvgIconComp
              key={at}
              src={getAttributeIconUrl(at)}
              alt="Gem Socket"
              height={35}
              width={35}
              selected={getAttributeTypeForGemType(type) === at}
              onClick={() => {
                const selectedType = getGemTypeFromAttribute(at)
                dispatch(
                  socketFilterSlice.actions.update({
                    index,
                    quality: level,
                    type: selectedType,
                  })
                )
                setType(selectedType)
              }}
            />
          ))}
          <Divider sx={{ margin: "10px" }} />
          <Typography>Level (from)</Typography>
          {gemQualities.map((gl) => (
            <SvgIconComp
              key={gl}
              src={getGemIconUrl(type, gl)}
              alt="Gem"
              height={35}
              width={35}
              selected={level === gl}
              onClick={() => {
                dispatch(
                  socketFilterSlice.actions.update({
                    index,
                    quality: gl,
                    type,
                  })
                )
                setLevel(gl)
              }}
            />
          ))}
        </>
      )}
    />
  )
}

export default GemSocketComp
