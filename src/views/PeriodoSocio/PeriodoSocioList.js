import React, { useState, useEffect, useCallback } from "react";
import Grid from "@material-ui/core/Grid";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import Table from "components/Table/Table.js";
import PeriodoSocioCreate from "./PeriodoSocioCreate";
import TextField from "@material-ui/core/TextField";
import service from "services/PeriodoSocioService";
import { toast } from "react-toastify";
import Search from "@material-ui/icons/Search";
import AutorenewIcon from "@material-ui/icons/Autorenew";
import { makeStyles } from "@material-ui/core/styles";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

const styles = {
  alert: {
    marginTop: "1rem",
  },
  formLabel:{
    fontSize: '12px'
  },
};

const estadosLabel = ["ACTIVO", "INACTIVO", "VENCEHOY", "VENCIDO"];

const useStyles = makeStyles(styles);

const initialDefaultValues = {
  planId: "",
  nombre: "",
  cantidadClases: "",
  costo: "",
  clasesPorDia: 1,
  estado: "ACTIVO",
};

const initialStates = {
  activo: false,
  inactivo: false,
  vencehoy: false,
  vencido: false,
  pagado: false,
}

const PeriodoSocioList = () => {
  const classes = useStyles();
  const [isVisible, setVisible] = useState(false);
  const [defaultValues, setDefaultValues] = useState(initialDefaultValues);
  const [data, setData] = useState({ periodos: [], isFetching: false });
  const [mensaje, setMensaje] = useState(null);
  
  const [ci, setCi] = useState();
  const [estado, setEstado] = useState(initialStates);

  const fetchData = useCallback(async () => {
    try {
      setData({ periodos: data.periodos, isFetching: true });
      const response = await service.getPeriodos(ci, estado);
      setData({ periodos: response, isFetching: false });
    } catch (e) {
      console.log(e);
      setData({ periodos: data.periodos, isFetching: false });
    }
  });

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (event) => {
    setEstado({ ...estado, [event.target.name]: event.target.checked });
  };

  const handleClear = async () => {
    setCi("");
    setEstado(initialStates);
  };
  const { activo, inactivo, vencehoy, vencido, pagado } = estado;

  const handleEdit = async (row) => {
    try {
      const periodo = await service.getPeriodoById(row.periodoId);

      await setDefaultValues({
        periodoId: periodo.periodoId,
        inicioVigencia: periodo.inicioVigencia,
        finVigencia: periodo.finVigencia,
        cantidadClasesTomadas: periodo.cantidadClasesTomadas,
        cantidadClasesDia: periodo.cantidadClasesDia,
        estado: periodo.estado,
        usuario: row.nombre + " " + row.apellido + " CI: " + row.ci,
        plan: row.plan,
      });

      setVisible(true);
    } catch (e) {
      console.log(e);
    }
  };

  const handleRemove = async (row) => {
    try {
      const response = await service.maintainPeriodById(
        row.periodoId,
        "CANCELAR"
      );
      if (response.status === "OK") {
        toast.success(response.message);
      }
      fetchData();
    } catch (e) {
      console.log(e);
    }
  };

  const handlePaid = async (row) => {
    try {
      const response = await service.maintainPeriodById(
        row.periodoId,
        "RENOVAR"
      );
      if (response.status === "OK") {
        toast.success(response.message);
      }
      fetchData();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      {!isVisible ? (
        <>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardBody>
                  <form>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          id="ci"
                          name="ci"
                          label="Cédula de Identidad"
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                          onChange={e => {
                            setCi(e.target.value);
                          }}
                          value={ci}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                      <FormControl>
                        <FormLabel id="estados" className={classes.formLabel}>Estados</FormLabel>
                        <FormGroup row>
                          <FormControlLabel
                            control={<Checkbox checked={activo} color='primary' onChange={handleChange} name="activo" />}
                            label="Activo"
                          />
                          <FormControlLabel
                            control={<Checkbox checked={inactivo} color='primary' onChange={handleChange} name="inactivo" />}
                            label="Inactivo"
                          />
                          <FormControlLabel
                            control={<Checkbox checked={vencehoy} color='primary' onChange={handleChange} name="vencehoy" />}
                            label="Vence Hoy"
                          />
                          <FormControlLabel
                            control={<Checkbox checked={vencido} color='primary' onChange={handleChange} name="vencido" />}
                            label="Vencido"
                          />
                          <FormControlLabel
                            control={<Checkbox checked={pagado} color='primary' onChange={handleChange} name="pagado" />}
                            label="Pagado"
                          />
                        </FormGroup>
                      </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Button
                          color="secondary"
                          aria-label="guardar"
                          onClick={handleClear}
                          justIcon
                          round
                        >
                          <AutorenewIcon />
                        </Button>
                        <Button
                          color="primary"
                          aria-label="buscar"
                          onClick={fetchData}
                          justIcon
                          round
                        >
                          <Search />
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                  <Table
                    tableHeaderColor="primary"
                    tableHead={[
                      "Inicio",
                      "Fin",
                      "Estado",
                      "Nombre",
                      "Apellido",
                      "Cedula",
                      "Plan",
                      "Acciones",
                    ]}
                    tableData={data.periodos}
                    tableAction={[handleEdit, handleRemove, handlePaid]}
                    tableRowId="periodoId"
                  />
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        </>
      ) : (
        <PeriodoSocioCreate
          defaultValues={defaultValues}
          setVisible={setVisible}
          fetchData={fetchData}
        />
      )}
    </div>
  );
};

export default PeriodoSocioList;
