import React, {useState, useEffect} from "react";
// import { makeStyles } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import Table from "components/Table/Table.js";
import UsuarioCreate from "./UsuarioCreate";
import AddIcon from '@material-ui/icons/Add';
import service from "services/UsuarioService";
import { toast } from "react-toastify";

const initialDefaultValues = {
  usuario_id: "",
  nombre: "",
  apellido: "",
  ci: "",
  email:"",
  telefono:"",
  direccion:"",
  password:""
};

const UsuarioList = () => {
  const [isVisible, setVisible] = useState(false); 
  const [defaultValues, setDefaultValues] = useState(initialDefaultValues); 
  const [data, setData] = useState({coaches: [], isFetching: false});

  useEffect(() => {
      const fetchUsuarios = async () => {
          try {
              setData({coaches: data.coaches, isFetching: true});
              const response = await service.getUsuarios();
              setData({coaches: response, isFetching: false});
          } catch (e) {
              console.log(e);
              setData({coaches: data.coaches, isFetching: false});
          }
      };
      fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
        setData({coaches: data.coaches, isFetching: true});
        const response = await service.getUsuarios();
        setData({coaches: response, isFetching: false});
    } catch (e) {
        console.log(e);
        setData({coaches: data.coaches, isFetching: false});
    }
  }

  const handleEdit = async (row) => {
    try {

      const user = await service.getUsuarioById(row.usuarioId);
      console.log(user)

      await setDefaultValues({
        usuario_id: user.usuarioId,
        nombre:user.nombre, 
        apellido:user.apellido, 
        ci: user.ci, 
        email: user.email, 
        telefono:user.telefono,
        direccion:user.direccion,
        password:user.password,
      })

      setVisible(true);
    } catch (e) {
      console.log(e);
    }
  }

  const handleRemove = async (row) => {
    try {
      const response = await service.changeStateUsuarioById(row.usuarioId, "INACTIVO");
      if (response.status === 'OK') {
        toast.success(response.message)
      }
      fetchUsuarios();
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
                  tableHead={["Nombre", "Apellido", "Correo", "Telefono", "Estado", "Acciones"]}
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
        ) : (<UsuarioCreate defaultValues={defaultValues} setVisible={setVisible} fetchUsuarios={fetchUsuarios} />)
      }
    </div>
  );
}

export default UsuarioList;