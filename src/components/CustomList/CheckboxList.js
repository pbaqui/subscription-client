import React from 'react';
import PropTypes from "prop-types";
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from "@material-ui/core/Collapse";
import FitnessCenter from '@material-ui/icons/FitnessCenter';
import Button from "components/CustomButtons/Button.js";
// import Radio from '@material-ui/core/Radio';
// import RadioGroup from '@material-ui/core/RadioGroup';
import Tooltip from '@material-ui/core/Tooltip';


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

export default function CheckboxList(props) {
  const classes = useStyles();
  const { values, defaultValues, register, onSubmit, handleSubmit, handleCancelar } = props;
  
  const [open, setOpen] = React.useState([]);

  const handleClick = (key) => () => {
    setOpen({ [key]: !open[key] });
  };
  
  const FormSwitch = ({
    name,
    value,
    register,
    defaultValue,
    disabled
  }) => {
    return (
      <FormControlLabel
        control={<Checkbox color='primary' defaultChecked={defaultValue} edge="start"/>}
        name={name}
        inputRef={register}
        value={value}
        disabled={disabled}
      />
    );
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <List className={{ root: classes.list }}>
        {values.map((plan) => {
              const openB = open[plan.planId] || false;
              return (
                <>
                  <ListItem key={plan.planId} button onClick={handleClick(plan.planId)}>
                    <ListItemIcon>
                      <FitnessCenter />
                    </ListItemIcon>
                    <ListItemText inset primary={plan.nombre} />
                    {openB ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>
                  <Collapse in={openB} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                    { plan.clases && plan.clases.length > 0 ? plan.clases.map((value) =>  (
                        <ListItem key={value.claseId} role={undefined} dense>
                          <ListItemIcon>
                            <FormSwitch
                                key={value.claseId}
                                name={`reservas[${value.claseId}]`}
                                value={value.claseId}
                                register={register}
                                defaultValue={defaultValues.some(p => p.claseId === value.claseId)}
                                disabled={defaultValues.some(p => p.claseId === value.claseId) || value.cantidadReservas >= value.cantidadMaxSocios || value.onlyCancelarReserva}
                              />
                          </ListItemIcon>
                        <ListItemText id={`checkbox-list-label-${value.claseId}`} primary={`${value.fechaInicio} - ${value.nombre}`} secondary={`Reservas: ${value.cantidadReservas}/${value.cantidadMaxSocios}`}/>
                        {(defaultValues.some(p => p.claseId === value.claseId) ) &&
                        <ListItemSecondaryAction>
                          <Tooltip title="Camcelar Reserva">
                            <IconButton edge="end" aria-label="cancelar" onClick={handleCancelar(value.claseId)}>
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </ListItemSecondaryAction>}
                      </ListItem>
                      )) 
                      : <ListItem key={`noclases-${plan.planId}`} dense>
                        <ListItemText id={`noclases-label-${plan.planId}`} primary="No posee clases disponibles"/>
                      </ListItem>
                    }
                    { plan.clases && plan.clases.length > 0 ?
                    <Button color="primary" aria-label="guardar" type="submit">
                      Guardar
                    </Button>
                    :""}
                    </List>
                  </Collapse>
                </>
              );
            })}         
      </List>
    </form>
  );
}

CheckboxList.propTypes = {
  values: PropTypes.arrayOf(PropTypes.object),
  defaultValues: PropTypes.arrayOf(PropTypes.object),
  register: PropTypes.func,
  onSubmit: PropTypes.func,
  handleSubmit: PropTypes.func,
  handleCancelar: PropTypes.func,
};

