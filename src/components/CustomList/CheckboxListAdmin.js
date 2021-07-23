import React from 'react';
import PropTypes from "prop-types";
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  list: {
    position: "absolute",
    overflow: "auto",
    bottom: "1em",
    top: "1em"
  }
}));

export default function CheckboxListAdmin(props) {
  const classes = useStyles();
  const { values, defaultValues, register } = props;
  
  const FormSwitch = ({
    name,
    value,
    register,
    defaultValue
  }) => {
    return (
      <FormControlLabel
        control={<Checkbox color='primary' defaultChecked={defaultValue} edge="start"/>}
        name={name}
        inputRef={register}
        value={value}
      />
    );
  };

  return (
    <List className={{ root: classes.list }}>
      {values.map((clase) => {
            return (
              <ListItem key={clase.claseId} dense>
                <ListItemIcon>
                  <FormSwitch
                      key={clase.claseId}
                      name={`reservas[${clase.claseId}]`}
                      value={clase.claseId}
                      register={register}
                      defaultValue={defaultValues.some(p => p.claseId === clase.claseId)}
                    />
                </ListItemIcon>
                <ListItemText id={`checkbox-list-label-${clase.claseId}`} primary={`${clase.fechaInicio} - ${clase.nombre}`} secondary={`Reservas: ${clase.cantidadReservas}/${clase.cantidadMaxSocios}`}/> 
                {/* <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction> */}
              </ListItem>
            );
          })}         
    </List>
  );
}

CheckboxListAdmin.propTypes = {
  values: PropTypes.arrayOf(PropTypes.object),
  defaultValues: PropTypes.arrayOf(PropTypes.object),
  register: PropTypes.func,
};

