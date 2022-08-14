import Box from "@mui/joy/Box"
import { Slider } from "@mui/material"
import * as React from "react"

type TAttributesSliderComp = {
  sx?: React.CSSProperties
}

export default function AttributesSliderComp({ sx }: TAttributesSliderComp) {
  const [value, setValue] = React.useState([20, 37])

  const handleChange = (
    event: Event,
    newValue: number | number[],
    activeThumb: number
  ) => {
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
        max={120}
        valueLabelFormat={(value: number, index: number) => (
          <div>
            Min. {index === 0 ? "Base" : "Assigned"}: {value}
          </div>
        )}
      />
    </Box>
  )
}
