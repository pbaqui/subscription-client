import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CardHeader from "components/Card/CardHeader.js";
import Button from "components/CustomButtons/Button.js";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import service from "services/PeriodoSocioService";
import PropTypes from "prop-types";
import { DatePicker } from "components/Datepicker/Datepicker";
import { RHFInput } from "react-hook-form-input";
import { Typography } from '@material-ui/core';

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
      lineHeight: "1",
    },
  },
  cardSubTitle: {
    // color: "#FFFFFF",
    marginTop: "3px",
    minHeight: "auto",
    fontWeight: "bold",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
  },
  cardBody: {
    marginTop: "0px",
  },
  formLabel: {
    fontSize: "12px",
  },
};

const useStyles = makeStyles(styles);

const PeriodoSocioCreate = ({ defaultValues, setVisible, fetchData }) => {
  const { register, handleSubmit, errors, control, setValue } = useForm({
    defaultValues,
  });

  // useEffect(() => {
  //     console.log(defaultValues);
  // }, []);

  const onSubmit = async (data) => {

    if (defaultValues.periodoId) {
      data.periodoId = defaultValues.periodoId;
    }
    
    console.log(JSON.stringify(data));

    const response = await service.savePeriodo(data);
    if (response.status === "OK") {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }

    fetchData();
    setVisible(false);
  };

  const handleBack = () => {
    setVisible(false);
  };

  const classes = useStyles();
  return (
    <>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader plain color="primary">
              <h6 className={classes.cardTitleWhite}>Editar Periodo</h6>
            </CardHeader>
            <CardBody>
              <form noValidate onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={12}>
                    <Typography className={classes.cardSubTitle}>{defaultValues.usuario}</Typography>
                    <Typography className={classes.cardSubTitle}>Plan: {defaultValues.plan}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <RHFInput
                      required
                      as={<DatePicker />}
                      name="inicioVigencia"
                      label="Inicio Vigencia"
                      register={register}
                      setValue={setValue}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <RHFInput
                      required
                      as={<DatePicker />}
                      name="finVigencia"
                      label="Fin Vigencia"
                      register={register}
                      setValue={setValue}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InputLabel id="estado" className={classes.formLabel}>
                      Estado
                    </InputLabel>
                    <Controller
                      fullWidth
                      as={
                        <Select>
                          <MenuItem value={"ACTIVO"}>ACTIVO</MenuItem>
                          <MenuItem value={"INACTIVO"}>INACTIVO</MenuItem>
                        </Select>
                      }
                      name="estado"
                      control={control}
                      id="estado"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      color="secondary"
                      aria-label="atras"
                      onClick={handleBack}
                    >
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
};

export default PeriodoSocioCreate;

PeriodoSocioCreate.propTypes = {
  defaultValues: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  setVisible: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired,
};
