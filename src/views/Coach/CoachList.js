import React, {useState, useEffect} from "react";
// import { makeStyles } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import Table from "components/Table/Table.js";
import CoachCreate from "./CoachCreate";
import AddIcon from '@material-ui/icons/Add';
import service from "services/CoachService";
import { toast } from "react-toastify";

const initialDefaultValues = {
  usuarioId: "",
  nombre: "",
  apellido: "",
  ci: "",
  email:"",
  telefono:"",
  direccion:"",
  fechaNacimiento: new Date(),
  tipo:"titular",
  password:""
};

const CoachList = () => {
  const [isVisible, setVisible] = useState(false); 
  const [defaultValues, setDefaultValues] = useState(initialDefaultValues); 
  const [data, setData] = useState({coaches: [], isFetching: false});

  useEffect(() => {
      const fetchCoaches = async () => {
          try {
              setData({coaches: data.coaches, isFetching: true});
              const response = await service.getCoaches();
              setData({coaches: response, isFetching: false});
          } catch (e) {
              console.log(e);
              setData({coaches: data.coaches, isFetching: false});
          }
      };
      fetchCoaches();
  }, []);

  const fetchCoaches = async () => {
    try {
        setData({coaches: data.coaches, isFetching: true});
        const response = await service.getCoaches();
        setData({coaches: response, isFetching: false});
    } catch (e) {
        console.log(e);
        setData({coaches: data.coaches, isFetching: false});
    }
  }

  const handleEdit = async (row) => {
    try {

      const user = await service.getCoachById(row.usuarioId);

      await setDefaultValues({
        usuarioId: user.usuario.usuarioId,
        nombre:user.usuario.nombre, 
        apellido:user.usuario.apellido, 
        ci:user.usuario.ci, 
        email: user.usuario.email, 
        telefono:user.usuario.telefono,
        direccion:user.usuario.direccion,
        fechaNacimiento:user.usuario.fechaNacimiento,
        tipo:user.tipo,
        password:user.usuario.password,
      })

      setVisible(true);
    } catch (e) {
      console.log(e);
    }
  }

  const handleRemove = async (row) => {
    try {
      const response = await service.changeStateCoachById(row.usuarioId, "INACTIVO");
      if (response.status === 'OK') {
        toast.success(response.message)
      }
      fetchCoaches();
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
                  tableHead={["Nombre", "Apellido", "Correo", "Telefono", "Tipo", "Estado", "Acciones"]}
                  tableData={data.coaches}
                  tableAction={[handleEdit, handleRemove]}
                  tableRowId="usuarioId"
                  // editMethod={handleEdit}
                  // removeMethod={handleRemove}
                />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
        </>
        ) : (<CoachCreate defaultValues={defaultValues} setVisible={setVisible} fetchCoaches={fetchCoaches} />)
      }
    </div>
  );
}

export default CoachList;