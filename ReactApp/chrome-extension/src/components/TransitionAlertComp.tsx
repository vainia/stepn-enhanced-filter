import * as React from "react"
import Box from "@mui/material/Box"
import Alert, { AlertColor } from "@mui/material/Alert"
import IconButton from "@mui/material/IconButton"
import Collapse from "@mui/material/Collapse"
import CloseIcon from "@mui/icons-material/Close"
import { AlertTitle } from "@mui/material"

type TTransitionAlertComp = {
  title: string
  message: string
  severity: AlertColor
}

const TransitionAlertComp = ({
  title,
  message,
  severity,
}: TTransitionAlertComp) => {
  const [open, setOpen] = React.useState(true)

  return (
    <Box sx={{ width: "100%" }}>
      <Collapse in={open}>
        <Alert
          severity={severity}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false)
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          <AlertTitle>{title}</AlertTitle>
          {message}
        </Alert>
      </Collapse>
    </Box>
  )
}

export default TransitionAlertComp
