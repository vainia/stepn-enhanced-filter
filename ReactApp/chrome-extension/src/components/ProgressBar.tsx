import { Typography } from "@mui/joy"
import { FormGroup } from "@mui/material"
import LinearProgress from "@mui/material/LinearProgress"

type TProgressBar = {
  maxProgress: number
  currentProgress: number
}

export default function ProgressBar({
  maxProgress,
  currentProgress,
}: TProgressBar) {
  const normalize = (value: number) => ((value - 0) * 100) / (maxProgress - 0)

  return (
    <FormGroup
      row
      sx={{
        px: "2px !important",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <LinearProgress
        sx={{ width: "85%" }}
        variant="determinate"
        value={normalize(currentProgress)}
      />
      <Typography>{`${Math.round(currentProgress)}/${maxProgress}`}</Typography>
    </FormGroup>
  )
}
