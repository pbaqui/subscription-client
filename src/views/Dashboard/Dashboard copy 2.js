import React, {useState} from "react";
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
import Store from "@material-ui/icons/Store";
import Warning from "@material-ui/icons/Warning";
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Update from "@material-ui/icons/Update";
import Accessibility from "@material-ui/icons/Accessibility";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Danger from "components/Typography/Danger.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import CheckboxList from "components/CustomList/CheckboxList";
import CheckboxListAdmin from "components/CustomList/CheckboxListAdmin";
import service from "services/ClaseService";
import Button from "components/CustomButtons/Button.js";
import {useForm, Controller} from 'react-hook-form';
import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import { toast } from "react-toastify";
import { useUser } from "components/UserProvider"
import { hasRoles } from 'utils';


const useStyles = makeStyles(styles);

export default function Dashboard() {
  const classes = useStyles();  
  const user = useUser();
  const [isLoading, setIsLoading] = React.useState(true);
  const [clases, setClases] = useState(null);
  const [planes, setPlanes] = useState(null);
  const [defaultValues, setDefaultValues] = useState([]); 
  const [open, setOpen] = React.useState(false);
  const { register, handleSubmit} = useForm({});

  const fetchData= React.useCallback(async () => {
    try {
        setIsLoading(true);
        const response = await service.getClasesDisponibles();
        console.log(response);
        if (response.planes) {
          setPlanes(response.planes)
        } else if (response.clases) {
          setClases(response.clases)
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

  const onSubmit = async(reservas) => {    
    // if (defaultValues.configuracionClaseId){
    //   configuracion.configuracionClaseId = defaultValues.configuracionClaseId;
    // } 
    // configuracion.horarios = horarios;
    const response = await service.saveReserva(reservas);
    if (response.status === 'OK') {
      toast.success(response.message)
    } else {
      toast.error(response.message)
    }
    
    fetchData();
    // setVisible(false);
  }

  return (
    <div>
      {/* <GridContainer>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="warning" stats icon>
              <CardIcon color="warning">
                <Icon>content_copy</Icon>
              </CardIcon>
              <p className={classes.cardCategory}>Used Space</p>
              <h3 className={classes.cardTitle}>
                49/50 <small>GB</small>
              </h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <Danger>
                  <Warning />
                </Danger>
                <a href="#pablo" onClick={e => e.preventDefault()}>
                  Get more space
                </a>
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="success" stats icon>
              <CardIcon color="success">
                <Store />
              </CardIcon>
              <p className={classes.cardCategory}>Revenue</p>
              <h3 className={classes.cardTitle}>$34,245</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <DateRange />
                Last 24 Hours
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="danger" stats icon>
              <CardIcon color="danger">
                <Icon>info_outline</Icon>
              </CardIcon>
              <p className={classes.cardCategory}>Fixed Issues</p>
              <h3 className={classes.cardTitle}>75</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <LocalOffer />
                Tracked from Github
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="info" stats icon>
              <CardIcon color="info">
                <Accessibility />
              </CardIcon>
              <p className={classes.cardCategory}>Followers</p>
              <h3 className={classes.cardTitle}>+245</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <Update />
                Just Updated
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer> */}
      <GridContainer>
        { planes &&
          <GridItem xs={12} sm={12} md={6}>
            <Card>
              <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>Reserva tu clase de hoy!</h4>
              </CardHeader>
              <CardBody>
                <form noValidate onSubmit={handleSubmit(onSubmit)}>
                  <CheckboxList values={planes} defaultValues={defaultValues} register={register}/>
                  <Button color="primary" aria-label="guardar" type="submit">
                    Guardar
                  </Button>
                </form>
              </CardBody>
            </Card>
          </GridItem> 
        }
        { clases &&
          <GridItem xs={12} sm={12} md={6}>
            <Card>
              <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>Reservar clase</h4>
              </CardHeader>
              <CardBody>
                <form noValidate onSubmit={handleSubmit(onSubmit)}>
                  <CheckboxListAdmin values={clases} defaultValues={defaultValues} register={register}/>
                  <Button color="primary" aria-label="guardar" onClick={handleClickOpen}>
                    Reservar
                  </Button>
                  <ReservarDialog selectedValue={selectedValue} open={open} onClose={handleClose} />
                </form>
              </CardBody>
            </Card>
          </GridItem> 
        }
        {/* <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="warning">
              <h4 className={classes.cardTitleWhite}>Employees Stats</h4>
              <p className={classes.cardCategoryWhite}>
                New employees on 15th September, 2016
              </p>
            </CardHeader>
            <CardBody>
              <Table
                tableHeaderColor="warning"
                tableHead={["ID", "Name", "Salary", "Country"]}
                tableData={[
                  ["1", "Dakota Rice", "$36,738", "Niger"],
                  ["2", "Minerva Hooper", "$23,789", "Curaçao"],
                  ["3", "Sage Rodriguez", "$56,142", "Netherlands"],
                  ["4", "Philip Chaney", "$38,735", "Korea, South"]
                ]}
              />
            </CardBody>
          </Card>
        </GridItem> */}
      </GridContainer>
    </div>
  );
}
