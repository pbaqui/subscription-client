import React, {useState} from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CardHeader from "components/Card/CardHeader.js";
import Button from "components/CustomButtons/Button.js";
import { toast } from "react-toastify";
import {useForm, Controller} from 'react-hook-form';
import service from "services/SocioService";
import PropTypes from 'prop-types';
import planService from "services/PlanService";
import List from "components/CustomList/List";
import { DatePicker } from 'components/Datepicker/Datepicker';
import { RHFInput } from "react-hook-form-input";

const styles = {
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "bold",
      lineHeight: "1"
    }
  }
};

const useStyles = makeStyles(styles);

const SocioCreate = ({defaultValues, setDefaultValues, setVisible, fetchSocios}) => {
  const { register, handleSubmit, errors, control, setValue} = useForm({defaultValues});
  const [planes, setPlanes] = useState({data: [], isFetching: false});
  
  const fetchPlanes = React.useCallback(async () => {
    try {
        setPlanes({data: planes.data, isFetching: true});
        const response = await planService.getPlanes({estado:"ACTIVO"});
        console.log(response);
        setPlanes({data: response, isFetching: false});
    } catch (e) {
        console.log(e);
        setPlanes({data: planes.data, isFetching: false});
    }
  });

  React.useEffect(() => {
    fetchPlanes();
  }, []);

  const onSubmit = async(data) => {
    console.log(data);
    
    if (defaultValues.usuarioId){
      data.usuarioId = defaultValues.usuarioId;
    } 
    const response = await service.saveSocio(data);
    if (response.status === 'OK') {
      toast.success(response.message)
    } else {
      toast.error(response.message)
    }
    
    fetchSocios();
    setVisible(false);
  }

  const handleBack = () => {
    setVisible(false);
  }

  const classes = useStyles();
  return (
   <>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader plain color="primary">
              <h6 className={classes.cardTitleWhite}>Crear Socio</h6>
            </CardHeader>
            <CardBody>
              <form noValidate onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      id="nombre"
                      name="nombre"
                      label="Nombre"
                      fullWidth
                      inputRef={register({ required: true })}
                      InputLabelProps={{ shrink: true }}
                    />
                    {errors.nombre && <span style={{color:'red'}}>* Este campo es obligatorio</span>}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      id="apellido"
                      name="apellido"
                      label="Apellido"
                      fullWidth
                      inputRef={register({ required: true })}
                      InputLabelProps={{ shrink: true }}
                    />
                    {errors.apellido && <span style={{color:'red'}}>* Este campo es obligatorio</span>}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      id="ci"
                      name="ci"
                      label="Cédula de Identidad"
                      fullWidth
                      inputRef={register({ required: true,
                        maxLength: { value: 8, message: "La longitud máxima es de 8" } })}
                      InputLabelProps={{ shrink: true}}
                    />
                    {errors.ci && <span style={{color:'red'}}>* Este campo es obligatorio</span>}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      id="email"
                      name="email"
                      label="Correo"
                      fullWidth
                      inputRef={register({ required: true,
                        pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Direccion de correo inválida"
                      } })}
                      InputLabelProps={{ shrink: true }}
                    />                    
                    {errors.email && <span style={{color:'red'}}>* Este campo es obligatorio {errors.email.message ? ( '*' +  errors.email.message) : (null)} </span>}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      id="telefono"
                      name="telefono"
                      label="Telefono"
                      type="number"
                      fullWidth
                      inputRef={register({ required: true })}
                      InputLabelProps={{ shrink: true }}
                    />
                    {errors.telefono && <span style={{color:'red'}}> * Este campo es obligatorio</span>}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      id="direccion"
                      name="direccion"
                      label="Direccion"
                      fullWidth
                      inputRef={register}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      id="ruc"
                      name="ruc"
                      label="Ruc"
                      fullWidth
                      inputRef={register}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      id="datoLaboral"
                      name="datoLaboral"
                      label="Dato Laboral"
                      fullWidth
                      inputRef={register}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <RHFInput
                      required
                      as={<DatePicker/>}
                      id="fechaNacimiento"
                      name="fechaNacimiento"
                      label="Fecha Nacimiento"
                      register={register}
                      setValue={setValue}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      id="password"
                      name="password"
                      label="Contraseña"
                      type="password"
                      fullWidth
                      inputRef={register({ required: true })}
                      InputLabelProps={{ shrink: true }}
                    />
                    {errors.password && <span style={{color:'red'}}>* Este campo es obligatorio</span>}
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Controller
                      name="inspeccion"
                      control={control}
                      render={(props) => (
                        <Checkbox
                          onChange={(e) => props.onChange(e.target.checked)}
                          checked={props.value}
                          color='primary'
                        />
                      )}
                    />
                    <label>Inspección Médica</label>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <List listHeader="Planes" listItem={planes.data} defaultValues={defaultValues} register={register}/>
                  </Grid>
                  <Grid item xs={12}>
                    <Button color="secondary" aria-label="guardar" onClick={handleBack}>
                      Atrás
                    </Button>
                    <Button color="primary" aria-label="guardar" type="submit">
                      Guardar
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
   </>
  );
}

export default SocioCreate;

SocioCreate.propTypes = {
  defaultValues: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  setDefaultValues: PropTypes.func.isRequired,
  setVisible: PropTypes.func.isRequired,
  fetchSocios: PropTypes.func.isRequired
};