import Box from "@mui/joy/Box"
import { Slider } from "@mui/material"
import * as React from "react"
import { attributeFilterSlice } from "../redux/reducers/attributesFilterReducer"
import { useAppDispatch } from "../redux/store"
import { TAttribute } from "../services/stepnAttributesService"

type TAttributesSliderComp = {
  type: TAttribute
  sx?: React.CSSProperties
  minBase?: number
  minAssigned?: number
}

export default function AttributesSliderComp({
  sx,
  type,
  minBase = 0,
  minAssigned = 0,
}: TAttributesSliderComp) {
  const [value, setValue] = React.useState([minBase, minAssigned])
  const dispatch = useAppDispatch()

  const handleChange = (
    event: Event,
    newValue: number | number[],
    activeThumb: number
  ) => {
    dispatch(
      attributeFilterSlice.actions.setTypeValues({
        type,
        minBase: value[0],
        minAssigned: value[1],
      })
    )
    setValue(newValue as [])
  }

  return (
    <Box sx={sx}>
      <Slider
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        track={false}
        min={0}
        max={112}
        step={0.1}
        valueLabelFormat={(value: number, index: number) => (
          <div>
            Min. {index === 0 ? "Base" : "Assigned"}: {value}
          </div>
        )}
      />
    </Box>
  )
}
