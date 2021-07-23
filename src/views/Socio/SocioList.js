import React, {useState} from "react";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import Table from "components/Table/Table.js";
import SocioCreate from "./SocioCreate";
import AddIcon from '@material-ui/icons/Add';
import service from "services/SocioService";
import { toast } from "react-toastify";

const initialDefaultValues = {
  usuarioId: "",
  nombre: "",
  apellido: "",
  ci:"",
  email:"",
  telefono:"",
  direccion:"",
  ruc:"",
  datoLaboral:"",
  fechaNacimiento: new Date(),
  password:"",
  inspeccion: false,
  planes:[]
};

const SocioList = () => {
  const [isVisible, setVisible] = useState(false); 
  const [defaultValues, setDefaultValues] = useState(initialDefaultValues); 
  const [data, setData] = useState({socios: [], isFetching: false});

  const fetchSocios = React.useCallback(async () => {
    try {
        setData({socios: data.socios, isFetching: true});
        const response = await service.getSocios();
        setData({socios: response, isFetching: false});
    } catch (e) {
        console.log(e);
        setData({socios: data.socios, isFetching: false});
    }
  });

  React.useEffect(() => {
      fetchSocios();
  }, []);

  const handleEdit = async (row) => {
    try {
      const user = await service.getSocioById(row.usuarioId);

      await setDefaultValues({
        usuarioId: user.usuarioId,
        nombre:user["usuario.nombre"], 
        apellido:user["usuario.apellido"], 
        ci:user["usuario.ci"], 
        email: user["usuario.email"], 
        telefono:user["usuario.telefono"], 
        direccion:user["usuario.direccion"], 
        ruc:user.ruc,
        datoLaboral:user.datoLaboral,
        fechaNacimiento :user["usuario.fechaNacimiento"],
        password:user["usuario.password"], 
        inspeccion:user.inspeccion,
        planes:user.planes
      })

      setVisible(true);
    } catch (e) {
      console.log(e);
    }
  }

  const handleRemove = async (row) => {
    try {
      const response = await service.changeStateSocioById(row.usuarioId, "INACTIVO");
      if (response.status === 'OK') {
        toast.success(response.message)
      }
      fetchSocios();
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
                  tableHead={["Nombre", "Apellido", "Correo", "Telefono", "CI", "Estado", "Acciones"]}
                  tableData={data.socios}
                  tableAction={[handleEdit, handleRemove]}
                  tableRowId="usuarioId"
                />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
        </>
        ) : (<SocioCreate defaultValues={defaultValues} setDefaultValues={setDefaultValues} setVisible={setVisible} fetchSocios={fetchSocios} />)
      }
    </div>
  );
}

export default SocioList;