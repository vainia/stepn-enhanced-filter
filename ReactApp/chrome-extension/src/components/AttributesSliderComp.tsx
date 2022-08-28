import Box from "@mui/joy/Box"
import { Slider } from "@mui/material"
import { useEffect, useState } from "react"
import {
  attributeFilterSlice,
  selectAttributeFilters,
} from "../redux/reducers/attributesFilterReducer"
import { useAppDispatch, useAppSelector } from "../redux/store"
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
  const { onlyBaseAttributes } = useAppSelector(selectAttributeFilters)

  const [value, setValue] = useState<number | number[]>([minBase, minAssigned])

  useEffect(() => {
    if (onlyBaseAttributes) setValue(minBase)
    else setValue([minBase, minAssigned])
  }, [onlyBaseAttributes, minAssigned, minBase])

  const dispatch = useAppDispatch()

  const handleChange = (
    event: Event,
    newValue: number | number[],
    activeThumb: number
  ) => {
    dispatch(
      attributeFilterSlice.actions.setTypeValues({
        type,
        minBase: typeof value === "number" ? value : value[0],
        minAssigned: typeof value === "number" ? 0 : value[1],
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
