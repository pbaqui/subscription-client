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
import service from "services/PlanService"
import PropTypes from 'prop-types';

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

const PlanCreate = ({defaultValues, setVisible, fetchPlanes}) => {
  const { register, handleSubmit, errors, control} = useForm({defaultValues});

  // useEffect(() => {
  //     console.log(defaultValues);
  // }, []);

  const onSubmit = async(data) => {
    console.log(JSON.stringify(data))
    
    if (defaultValues.planId){
      data.planId = defaultValues.planId;
    } 
    const response = await service.savePlan(data);
    if (response.status === 'OK') {
      toast.success(response.message)
    } else {
      toast.error(response.message)
    }
    
    fetchPlanes();
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
              <h6 className={classes.cardTitleWhite}>Crear Plan</h6>
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
                      id="cantidadClases"
                      name="cantidadClases"
                      label="Cantidad de Clases"
                      type="number"
                      fullWidth
                      inputRef={register({ required: true })}
                      InputLabelProps={{ shrink: true }}
                    />
                    {errors.cantidadClases && <span style={{color:'red'}}> * Este campo es obligatorio</span>}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      id="costo"
                      name="costo"
                      label="Costo"
                      type="number"
                      fullWidth
                      inputRef={register({ required: true })}
                      InputLabelProps={{ shrink: true }}
                    />
                    {errors.costo && <span style={{color:'red'}}> * Este campo es obligatorio</span>}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      id="clasesPorDia"
                      name="clasesPorDia"
                      label="Cantidad de clases por dia"
                      type="number"
                      fullWidth
                      inputRef={register({ required: true })}
                      InputLabelProps={{ shrink: true }}
                    />
                    {errors.clasesPorDia && <span style={{color:'red'}}> * Este campo es obligatorio</span>}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InputLabel id="estado" className={classes.formLabel}>Estado</InputLabel>
                    <Controller fullWidth
                      as={
                        <Select>
                          <MenuItem value={'ACTIVO'}>ACTIVO</MenuItem>
                          <MenuItem value={'INACTIVO'}>INACTIVO</MenuItem>
                        </Select>
                      }
                      name="estado"
                      control={control}
                      id="estado"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button color="secondary" aria-label="guardar" onClick={handleBack}>
                      Atr??s
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

export default PlanCreate;

PlanCreate.propTypes = {
  defaultValues: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  setVisible: PropTypes.func.isRequired,
  fetchPlanes: PropTypes.func.isRequired
};