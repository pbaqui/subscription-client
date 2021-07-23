import React, {useState, useEffect} from "react";
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
import PropTypes from 'prop-types';
import FormGroup from '@material-ui/core/FormGroup';
import { RHFInput } from "react-hook-form-input";
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { DatePicker } from 'components/Datepicker/Datepicker';
import { TimePicker } from 'components/Timepicker/Timepicker';
import List from "components/CustomList/List";
import planService from "services/PlanService";
import coachService from "services/CoachService";
import service from "services/ConfiguracionClaseService";
import MaterialTable from 'material-table';
import { timeFromDBToUI, createDateTimeWithTime } from 'utils';

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

const ConfigurarClaseCreate = ({defaultValues, setVisible, fetchConfiguraciones}) => {
  const { register, handleSubmit, errors, control, setValue} = useForm({defaultValues});
  const [planes, setPlanes] = useState({data: [], isFetching: false});
  const [coaches, setCoaches] = useState([]);
  const [asistentes, setAsistentes] = useState([]);

  const semana = ['Domingo', 'Lunes', 'Martes','Miercoles','Jueves','Viernes','Sabado'];

  const [horarios, setHorarios] = useState(defaultValues.horarios);

  useEffect(() => {
    console.log(defaultValues);
    const fetchPlanes = async () => {
      try {
          setPlanes({data: planes.data, isFetching: true});
          const response = await planService.getPlanes({estado:"ACTIVO"});
          setPlanes({data: response, isFetching: false});
      } catch (e) {
          console.log(e);
          setPlanes({data: planes.data, isFetching: false});
      }
    };
    fetchPlanes();
    const fetchCoaches = async () => {
      try {
        const result = await coachService.getCoachesList({tipo:"titular"});
        setCoaches(result);
      } catch (e) {
        console.log(e);
      }
    };
    fetchCoaches();
    const fetchAsistentes = async () => {
      try {
        const result = await coachService.getCoachesList({tipo:"asistente"});
        setAsistentes(result);
      } catch (e) {
        console.log(e);
      }
    };
    fetchAsistentes();
  }, []);
  
  const onSubmit = async(configuracion) => {    
    if (defaultValues.configuracionClaseId){
      configuracion.configuracionClaseId = defaultValues.configuracionClaseId;
    } 
    configuracion.horarios = horarios;
    const response = await service.saveConfiguracion(configuracion);
    if (response.status === 'OK') {
      toast.success(response.message)
    } else {
      toast.error(response.message)
    }
    
    fetchConfiguraciones();
    setVisible(false);
  }

  const handleBack = () => {
    setVisible(false);
  }

  const classes = useStyles();

  // const handleChange = useCallback(
  //   evt => {
  //     const { name } = evt.target;
  //     console.log('onChange:', {name});
  //   },
  //   [formState.touched]
  // );

  return (
   <>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader plain color="primary">
              <h6 className={classes.cardTitleWhite}>Crear configuracion</h6>
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
                      id="titulo"
                      name="titulo"
                      label="Titulo Clase"
                      fullWidth
                      inputRef={register({ required: true })}
                      InputLabelProps={{ shrink: true }}
                    />
                    {errors.titulo && <span style={{color:'red'}}>* Este campo es obligatorio</span>}
                  </Grid>            
                  <Grid item xs={12} sm={6}>
                    <RHFInput
                      required
                      as={<DatePicker />}
                      name="fechaInicio"
                      label="Fecha Inicio"
                      register={register}
                      setValue={setValue}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <RHFInput
                      required
                      as={<DatePicker />}
                      name="fechaFin"
                      label="Fecha Fin"
                      register={register}
                      setValue={setValue}
                    />
                  </Grid>                 
                  <Grid item xs={12} sm={12}>
                    <InputLabel id="dias" className={classes.formLabel}>Dias de la semana *</InputLabel>
                    <FormGroup aria-label="Semana" row={true}>
                      {semana.map((item, i) => (
                        <FormControlLabel
                          key={item}
                          value={item}
                          control={
                            <RHFInput
                              as={<Checkbox color='primary'/>}
                              name={`dias[${i}]`}
                              type="checkbox"
                              value={item}
                              register={register}
                              setValue={setValue}
                            />
                          }
                          fullWidth
                          label={item}
                        />
                      ))}
                    </FormGroup>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      required
                      id="cantidadSocios"
                      name="cantidadSocios"
                      label="Cantidad de Socios"
                      type="number"
                      fullWidth
                      inputRef={register({ required: true })}
                      InputLabelProps={{ shrink: true }}
                    />
                    {errors.telefono && <span style={{color:'red'}}> * Este campo es obligatorio</span>}
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      required
                      id="cantidadSociosEspera"
                      name="cantidadSociosEspera"
                      label="Cantidad de lista espera"
                      type="number"
                      fullWidth
                      inputRef={register}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
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
                    <MaterialTable
                      title="Agregar Horario"
                      columns={[
                        { 
                          title: 'Hora Inicio', 
                          field: 'horaInicio', 
                          type: "datetime",
                          render: (data) => {
                            return timeFromDBToUI(data.horaInicio)
                          },
                          editComponent: ({ value, onChange }) => (
                            <TimePicker
                              id="horaInicioTimePicker"
                              label="Hora Inicio"
                              value={createDateTimeWithTime(value)}
                              onChange={onChange}
                            />
                          )
                        },
                        { 
                          title: 'Hora Fin', 
                          field: 'horaFin', 
                          type: "datetime",
                          render: (data) => {
                            return timeFromDBToUI(data.horaFin)
                          },
                          editComponent: ({ value, onChange }) => (
                            <TimePicker
                              id="horaFinTimePicker"
                              label="Hora Fin"
                              value={createDateTimeWithTime(value)}
                              onChange={onChange}
                            />
                          )
                        },
                        { title: 'Coach', field: 'coachId', lookup: coaches },
                        { title: 'Asistente', field: 'asistenteId', lookup: asistentes},
                      ]}
                      data={horarios}
                      editable={{
                        onRowAdd: newData =>
                          new Promise((resolve, reject) => {
                            setTimeout(() => {
                              setHorarios([...horarios, newData]);
                              
                              resolve();
                            }, 1000)
                          }),
                        onRowUpdate: (newData, oldData) =>
                          new Promise((resolve, reject) => {
                            setTimeout(() => {
                              const dataUpdate = [...horarios];
                              const index = oldData.tableData.id;
                              dataUpdate[index] = newData;
                              setHorarios([...dataUpdate]);

                              resolve();
                            }, 1000)
                          }),
                        onRowDelete: oldData =>
                          new Promise((resolve, reject) => {
                            setTimeout(() => {
                              const dataDelete = [...horarios];
                              const index = oldData.tableData.id;
                              dataDelete.splice(index, 1);
                              setHorarios([...dataDelete]);
                              
                              resolve()
                            }, 1000)
                          }),
                      }}
                      options={{
                        actionsColumnIndex: -1,
                        search: false
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <List listHeader="Planes" listItem={planes.data} defaultValues={defaultValues} register={register}/>
                  </Grid> 
                  <Grid item xs={12}>
                    <Button color="secondary" aria-label="atras" onClick={handleBack}>
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

export default ConfigurarClaseCreate;

ConfigurarClaseCreate.propTypes = {
  defaultValues: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  setVisible: PropTypes.func.isRequired,
  fetchConfiguraciones: PropTypes.func.isRequired
};