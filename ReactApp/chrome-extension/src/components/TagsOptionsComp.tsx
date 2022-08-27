import { Checkbox, FormLabel } from "@mui/joy"
import {
  createFilterOptions,
  Autocomplete,
  TextField,
  styled,
  TextFieldProps,
  OutlinedInputProps,
} from "@mui/material"

export type TAutocompleteOption = {
  inputValue?: string
  data: string
}

type TTagsOptionsComp = {
  label: string
  options: TAutocompleteOption[]
}

const RedditTextField = styled((props: TextFieldProps) => (
  <TextField
    InputProps={{ disableUnderline: true } as Partial<OutlinedInputProps>}
    {...props}
  />
))(() => ({
  "& .MuiInputBase-root": {
    overflow: "hidden",
    borderRadius: 8,
    backgroundColor: "var(--joy-palette-neutral-softBg)",
    fieldset: {
      borderWidth: "0px",
    },
    "&:hover": {
      backgroundColor: "var(--joy-palette-neutral-softHoverBg)",
    },
    "&.Mui-focused": {
      backgroundColor: "transparent",
      ".MuiOutlinedInput-notchedOutline": {
        borderWidth: 2,
      },
      fieldset: {
        top: -3,
      },
    },
  },
}))

const TagsOptionsComp = ({ label, options }: TTagsOptionsComp) => {
  const filter = createFilterOptions<TAutocompleteOption>()

  return (
    <Autocomplete
      multiple
      size="small"
      options={options}
      disableCloseOnSelect
      getOptionLabel={(option) => option.data}
      filterOptions={(options, params) => {
        const filtered = filter(options, params)
        const { inputValue } = params

        // Suggest the creation of a new value
        const isExisting = options.some((option) => inputValue === option.data)
        if (inputValue !== "" && !isExisting) {
          filtered.push({
            inputValue,
            data: `Custom "${inputValue}"`,
          })
        }
        return filtered
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox style={{ marginRight: 8 }} checked={selected} />
          {option.data}
        </li>
      )}
      renderInput={(params) => (
        <>
          <FormLabel>{label}</FormLabel>
          <RedditTextField {...params} />
        </>
      )}
    />
  )
}

export default TagsOptionsComp
