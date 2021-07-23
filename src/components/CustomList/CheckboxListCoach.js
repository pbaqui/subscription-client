import React from 'react';
import PropTypes from "prop-types";
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import StarSharpIcon from '@material-ui/icons/StarSharp';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { Typography } from '@material-ui/core';

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
  },
  icon: {
    color: 'red',
  }
}));

export default function CheckboxListCoach(props) {
  const classes = useStyles();
  const { value, defaultValues, register } = props;
  
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
      {(value.socios && value.socios.length > 0) ? value.socios.map((socio) => {
            return (
              <ListItem key={socio.usuario} dense>
                <ListItemIcon>
                    <FormSwitch
                        key={socio.usuarioId}
                        name={`asistencias[${socio.usuarioId}]`}
                        value={socio.usuarioId}
                        register={register}
                        defaultValue={socio.presente}
                      />
                  </ListItemIcon>
                  <ListItemText id={`checkbox-list-label-${socio.usuarioId}`} primary={`${socio.nombre}`}/>
                  { socio.prueba &&
                  <ListItemSecondaryAction>
                    <ListItemIcon edge="end" aria-label="prueba" className={classes.icon}>
                      <StarSharpIcon/>
                    </ListItemIcon>
                  </ListItemSecondaryAction>}
              </ListItem>
            );
          }) 
        : <Typography>No se han registrado socios</Typography>}         
    </List>
  );
}

CheckboxListCoach.propTypes = {
  value: PropTypes.object,
  defaultValues: PropTypes.arrayOf(PropTypes.object),
  register: PropTypes.func,
};

