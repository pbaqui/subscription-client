import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CardHeader from "components/Card/CardHeader.js";
import Button from "components/CustomButtons/Button.js";
import { toast } from "react-toastify";
import {useForm, Controller} from 'react-hook-form';
import service from "services/CoachService"
import PropTypes from 'prop-types';
import { DatePicker } from 'components/Datepicker/Datepicker';
import { RHFInput } from "react-hook-form-input";

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF"
    }
  },
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
  },
  cardBody: {
    marginTop: "0px"
  },
  formLabel:{
    fontSize: '12px'
  },
};

const useStyles = makeStyles(styles);

const CoachCreate = ({defaultValues, setVisible, fetchCoaches}) => {
  const { register, handleSubmit, errors, control, setValue, getValues} = useForm({defaultValues});

  // useEffect(() => {
  //     console.log(defaultValues);
  // }, []);

  const onSubmit = async(data) => {
    console.log(JSON.stringify(data))
    
    if (defaultValues.usuarioId){
      data.usuarioId = defaultValues.usuarioId;
    } 
    const response = await service.saveCoach(data);
    if (response.status === 'OK') {
      toast.success(response.message)
    } else {
      toast.error(response.message)
    }
    
    fetchCoaches();
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
              <h6 className={classes.cardTitleWhite}>Crear Coach</h6>
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
                      InputLabelProps={{ shrink: true}}
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
                    <RHFInput
                      required
                      as={<DatePicker onChange={setValue} id="fechaNacimiento" label="Fecha Nacimiento" required={true}/>}
                      id="fechaNacimiento"
                      name="fechaNacimiento"
                      label="Fecha Nacimiento"
                      register={register}
                      setValue={setValue}
                    /> 
                    {errors.fechaNacimiento && <span style={{color:'red'}}>* Este campo es obligatorio</span>}
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
                  <Grid item xs={12} sm={6}>
                    {/* <label>Tipo</label> */}
                    <InputLabel id="tipo" className={classes.formLabel}>Tipo</InputLabel>
                    <Controller fullWidth
                      as={
                        <Select>
                          <MenuItem value={'titular'}>titular</MenuItem>
                          <MenuItem value={'asistente'}>asistente</MenuItem>
                        </Select>
                      }
                      name="tipo"
                      control={control}
                      id="tipo"
                    />
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

export default CoachCreate;

CoachCreate.propTypes = {
  defaultValues: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  setVisible: PropTypes.func.isRequired,
  fetchCoaches: PropTypes.func.isRequired
};