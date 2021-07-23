import React, {useState} from "react";
import { makeStyles } from "@material-ui/core/styles";
import { CircularProgress } from '@material-ui/core';
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CheckboxList from "components/CustomList/CheckboxList";
import CheckboxListAdmin from "components/CustomList/CheckboxListAdmin";
import CheckboxListCoach from "components/CustomList/CheckboxListCoach";
import service from "services/ClaseService";
import Button from "components/CustomButtons/Button.js";
import {useForm} from 'react-hook-form';
import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import { toast } from "react-toastify";
import { useUser } from "components/UserProvider";
import ReservarDialog from "views/Dashboard/ReservarDialog";
import FitnessCenter from '@material-ui/icons/FitnessCenter';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

const useStyles = makeStyles(styles);

export default function Dashboard() {
  const classes = useStyles();  
  const user = useUser();
  const [isLoading, setIsLoading] = React.useState(true);
  const [clases, setClases] = useState(null);
  const [planes, setPlanes] = useState(null);
  const [clasesCoach, setClasesCoach] = useState(null);
  const [defaultValues, setDefaultValues] = useState([]); 
  const [open, setOpen] = React.useState(false);
  const { register, handleSubmit, getValues, setValue } = useForm({});

  const fetchData= React.useCallback(async () => {
    try {
        setIsLoading(true);
        const response = await service.getClasesDisponibles();
        // console.log("response: ", response);
        if (response.planes) {
          setPlanes(response.planes);
          setDefaultValues(response.reservas);
        } 
        if (response.clases) {
          setClases(response.clases);
        } 
        if (response.clasesCoach) {
          setClasesCoach(response.clasesCoach);
        } 
    } catch (e) {
        console.log(e);
        setIsLoading(false);
        return;
    }
    setIsLoading(false);
  });

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  }; 

  const handleClose = () => {
    setOpen(false);
    fetchData();
  };

  const handleCancelar = (claseId) => async() => {
    const response = await service.cancelarReserva(claseId);
  
    if (response && response.status === 'OK') {
      toast.success(response.message);
    } else {
      if(response == null){
        toast.error("Ocurrió un error");
      }else {
        toast.error(response.message);
      }
    }  
    fetchData();
  };

  const onSubmit = async(data) => {    
    let response;
    //Registra la asistencia de los alumnos, lo realiza el perfil del coach
    if( data && data.asistencias){
      // console.log(data.asistencias);
      response = await service.saveAsistencia(data, clasesCoach.claseId);

    } else {
      //Realiza la reserva para el socio
      response = await service.saveReserva(data);
    }
    if (response && response.status === 'OK') {
      setValue("asistencias",[]);
      toast.success(response.message);
    } else {
      if(response == null){
        toast.error("Ocurrió un error");
      }else {
        toast.error(response.message);
      }
    }  
    fetchData();
  }

  return (
    <div>
      {isLoading && (
        <div className={classes.container}>
          <CircularProgress />
        </div>
      )}

      { !isLoading &&
      <GridContainer>
        {/* Usuario Socio */}
        { planes &&
          <GridItem xs={12} sm={12} md={6}>
            <Card>
              <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>Reserva tu clase de hoy!</h4>
              </CardHeader>
              <CardBody>
                {/* <form noValidate onSubmit={handleSubmit(onSubmit)}> */}
                  <CheckboxList values={planes} defaultValues={defaultValues} register={register} handleSubmit={handleSubmit} onSubmit={onSubmit} handleCancelar={handleCancelar}/>
                {/* </form> */}
              </CardBody>
            </Card>
          </GridItem> 
        }
        {/* Usuario Administrador */}
        { clases &&
          <GridItem xs={12} sm={12} md={6}>
            <Card>
              <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>Reservar Clase Admin</h4>
              </CardHeader>
              <CardBody>
                {/* <form noValidate onSubmit={handleSubmit(onSubmit)}> */}
                  <CheckboxListAdmin values={clases} defaultValues={defaultValues} register={register}/>
                  <Button color="primary" aria-label="guardar" onClick={handleClickOpen}>
                    Reservar
                  </Button>
                  <ReservarDialog data={getValues()} open={open} onClose={handleClose} />
                {/* </form> */}
              </CardBody>
            </Card>
          </GridItem> 
        }
        {/* Usuario Coach */}
        { clasesCoach &&
          <GridItem xs={12} sm={12} md={6}>
            <Card>
              <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>Tomar Asistencia Clase</h4>
              </CardHeader>
              <CardBody>
                { clasesCoach.claseId && (
                  <form noValidate onSubmit={handleSubmit(onSubmit)}>
                    <List className={{ root: classes.list }}>
                    <ListItem key={clasesCoach.claseId}>
                      <ListItemIcon>
                        <FitnessCenter />
                      </ListItemIcon>
                      <ListItemText inset primary={`${clasesCoach.fechaInicio} - ${clasesCoach.nombre}`} />
                    </ListItem>
                    </List>
                    <CheckboxListCoach value={clasesCoach} defaultValues={defaultValues} register={register}/>
                    <Button color="primary" aria-label="presente" type="submit">
                      Presente
                    </Button>
                  </form>
                )}
                { !clasesCoach.claseId && (
                  <Typography>No hay clases disponibles</Typography>
                )}
              </CardBody>
            </Card>
          </GridItem> 
        }
      </GridContainer>
      }
    </div>
  );
}
