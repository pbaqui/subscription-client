import { string, func, instanceOf, bool } from 'prop-types';
import React from 'react';
import { KeyboardTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';

import DateFnsUtils from '@date-io/date-fns';
import { makeStyles } from '@material-ui/core/styles';
import styles from './styles';

const useStyles = makeStyles(styles);
export function TimePicker({
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
  const classes = useStyles();
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardTimePicker
        disableToolbar
        label={label}
        autoOk
        placeholder="HH:mm"
        clearable
        value={value}
        onChange={onChange}
        format="HH:mm"
        required={required}
        id={id}
        InputLabelProps={{className: classes.label, shrink: true }}
        minDate={minDate}
        maxDate={maxDate}
        variant={variant}
        inputVariant={inputVariant}
        InputProps={{ classes }}
        size={size}
        fullWidth
        ampm={false}
      />
    </MuiPickersUtilsProvider>
  );
}

TimePicker.propTypes = {
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

TimePicker.defaultProps = {
  minDate: undefined,
  maxDate: undefined,
  variant: 'inline',
  inputVariant: 'filled',
  required: false,
  size: 'large',
};