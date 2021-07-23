import React, {useState, useEffect} from "react";
// import { makeStyles } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import Table from "components/Table/Table.js";
import PlanCreate from "./PlanCreate";
import AddIcon from '@material-ui/icons/Add';
import service from "services/PlanService";
import { toast } from "react-toastify";

const initialDefaultValues = {
  planId: "",
  nombre: "",
  cantidadClases: "",
  costo: "",
  clasesPorDia: 1,
  estado:"ACTIVO"
};

const PlanList = () => {
  const [isVisible, setVisible] = useState(false); 
  const [defaultValues, setDefaultValues] = useState(initialDefaultValues); 
  const [data, setData] = useState({planes: [], isFetching: false});

  useEffect(() => {
      const fetchPlanes = async () => {
          try {
              setData({planes: data.planes, isFetching: true});
              const response = await service.getPlanes();
              setData({planes: response, isFetching: false});
          } catch (e) {
              console.log(e);
              setData({planes: data.planes, isFetching: false});
          }
      };
      fetchPlanes();
  }, []);

  const fetchPlanes = async () => {
    try {
        setData({planes: data.planes, isFetching: true});
        const response = await service.getPlanes();
        setData({planes: response, isFetching: false});
    } catch (e) {
        console.log(e);
        setData({planes: data.planes, isFetching: false});
    }
  }

  const handleEdit = async (row) => {
    try {

      console.log(row);
      const plan = await service.getPlanById(row.planId);
      

      console.log(plan);

      await setDefaultValues({
        planId: plan.planId,
        nombre:plan.nombre, 
        cantidadClases:plan.cantidadClases, 
        costo: plan.costo, 
        estado:plan.estado,
        clasesPorDia: plan.clasesPorDia
      })

      setVisible(true);
    } catch (e) {
      console.log(e);
    }
  }

  const handleRemove = async (row) => {
    try {
      const response = await service.changeStatePlanById(row.planId, "INACTIVO");
      if (response.status === 'OK') {
        toast.success(response.message)
      }
      fetchPlanes();
    } catch (e) {
      console.log(e);
    }
  }

  const agregarNuevo = () => {
    setDefaultValues(initialDefaultValues);
    setVisible(true);
  };

  return (
    <div>
      { !isVisible ? (
        <>
        <Button color="white" aria-label="edit" justIcon round onClick={agregarNuevo}>
            <AddIcon />
        </Button>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              {/* <CardHeader plain color="primary">
                <h4 className={classes.cardTitleWhite}>Simple Table</h4>
              </CardHeader> */}
              <CardBody>
                <Table
                  tableHeaderColor="primary"
                  tableHead={["Nombre", "Cantidad Clases", "Costo", "Estado", "Acciones"]}
                  tableData={data.planes}
                  tableAction={[handleEdit, handleRemove]}
                  tableRowId="planId"
                  // editMethod={handleEdit}
                  // removeMethod={handleRemove}
                />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
        </>
        ) : (<PlanCreate defaultValues={defaultValues} setVisible={setVisible} fetchPlanes={fetchPlanes} />)
      }
    </div>
  );
}

export default PlanList;