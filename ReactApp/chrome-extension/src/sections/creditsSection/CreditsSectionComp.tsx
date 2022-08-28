import { InfoOutlined } from "@mui/icons-material"
import { Box, Typography, Link } from "@mui/joy"
import { FormGroup } from "@mui/material"
import CopyTooltipButton from "../../components/CopyTooltipButton"

const CreditsSectionComp = () => {
  return (
    <Box>
      <Typography level="body2">
        Thanks to everyone for valuable improvement ideas and reported bugs.
        Individual recognition to{" "}
        <Link href="https://github.com/karlkhader" target="_blank">
          karlkhader
        </Link>{" "}
        for a collaboration on this project.
      </Typography>
      <Typography textAlign="center" level="h3">
        <Link
          mx="auto"
          href="https://linktr.ee/inapolsky"
          target="_blank"
          my={2}
          endDecorator={<InfoOutlined />}
        >
          LinkTree
        </Link>
      </Typography>
      <FormGroup
        row
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="outlined" color="success">
          Support project with SOL, GST or GMT
        </Typography>
        <CopyTooltipButton
          label="Wallet"
          textToCopy="2stFvNdELDQ56C6vD71Lt3jKN9Th4r7cfkpJchwyxJ6x"
          tooltipText="Wallet address copied into the buffer 🥰"
        />
        <Typography level="body2">
          <Link href="https://u24.gov.ua/donate/renew" target="_blank">
            #StandWithUkraine
          </Link>
        </Typography>
      </FormGroup>
    </Box>
  )
}

export default CreditsSectionComp
