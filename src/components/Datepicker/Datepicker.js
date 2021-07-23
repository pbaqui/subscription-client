import { string, func, instanceOf, bool } from 'prop-types';
import React from 'react';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

export function DatePicker({
  value,
  onChange,
  id,
  label,
  minDate,
  maxDate,
  variant,
  inputVariant,
  required,
  size,
}) {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        disableToolbar
        label={label}
        autoOk
        placeholder="dd-MM-yyyy"
        clearable
        value={value ? value : null}
        onChange={onChange}
        format="dd-MM-yyyy"
        required={required}
        id={id}
        InputLabelProps={{shrink: true }}
        minDate={minDate}
        maxDate={maxDate}
        variant={variant}
        inputVariant={inputVariant}
        size={size}
        fullWidth
      />
    </MuiPickersUtilsProvider>
  );
}

DatePicker.propTypes = {
  value: instanceOf(Date).isRequired,
  onChange: func.isRequired,
  id: string.isRequired,
  label: string.isRequired,
  minDate: instanceOf(Date),
  maxDate: instanceOf(Date),
  variant: string,
  inputVariant: string,
  required: bool,
  size: string,
};

DatePicker.defaultProps = {
  minDate: undefined,
  maxDate: undefined,
  variant: 'inline',
  inputVariant: 'standard',
  required: false,
  size: 'medium',
};