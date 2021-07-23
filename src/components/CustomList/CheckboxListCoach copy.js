import React from 'react';
import PropTypes from "prop-types";
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from "@material-ui/core/Collapse";
import Button from "components/CustomButtons/Button.js";
import FitnessCenter from '@material-ui/icons/FitnessCenter';
import StarSharpIcon from '@material-ui/icons/StarSharp';
import {useForm} from 'react-hook-form';

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
  nested: {
    paddingLeft: theme.spacing(6),
  },
  icon: {
    color: 'red',
  }
}));

export default function CheckboxListCoach(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  // const { values, defaultValues, register } = props;
  const { values } = props;
  const { register, handleSubmit, getValues } = useForm(values);

  const handleClick = () => {
    setOpen(!open);
  };

  const onSubmit = async(data) => {    
    console.log(data);
    // const response = await service.saveReserva(reservas);
    // if (response.status === 'OK') {
    //   toast.success(response.message)
    // } else {
    //   toast.error(response.message)
    // }    
    // fetchData();
  }
  
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
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <ListItem key={values.claseId} button onClick={handleClick()}>
          <ListItemIcon>
            <FitnessCenter />
          </ListItemIcon>
          <ListItemText inset primary={`${values.fechaInicio} - ${values.nombre}`} />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {values.socios.map((value) => {
              return (
                <ListItem key={value.usuarioId} role={undefined} dense className={classes.nested}>
                  <ListItemIcon>
                    <FormSwitch
                        key={value.usuarioId}
                        name={`asistencias[${values.claseId}-${value.usuarioId}]`}
                        value={!value.presente}
                        register={register}
                        defaultValue={value.presente}
                      />
                  </ListItemIcon>
                  <ListItemText id={`checkbox-list-label-${value.usuarioId}`} primary={`${value.nombre}`}/>
                  { value.prueba &&
                  <ListItemSecondaryAction>
                    <ListItemIcon edge="end" aria-label="prueba" className={classes.icon}>
                      <StarSharpIcon/>
                    </ListItemIcon>
                  </ListItemSecondaryAction>}
                </ListItem>
              );
            })}
            <Button color="primary" aria-label="presente" type="submit">Presente</Button>
          </List>
        </Collapse>
      </form>
    </List>
  );
}

CheckboxListCoach.propTypes = {
  values: PropTypes.object,
  // register: PropTypes.func,
};

