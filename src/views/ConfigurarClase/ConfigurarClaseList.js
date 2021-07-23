import React, {useState, useEffect} from "react";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import Table from "components/Table/Table.js";
import ConfigurarClaseCreate from "./ConfigurarClaseCreate";
import AddIcon from '@material-ui/icons/Add';
import service from "services/ConfiguracionClaseService";
import { toast } from "react-toastify";

const today = new Date();
const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth()+1, 0);
// const event = new Date('August 19, 1975 00:30:00');
// const event2 = new Date('August 19, 1975 22:00:00');

const initialDefaultValues = {
  configuracionClaseId: "",
  nombre: "",
  titulo:"",
  fechaInicio:today,
  fechaFin:lastDayOfMonth,
  dias: [],
  cantidadSocios: "",
  cantidadSociosEspera:"",
  estado:"ACTIVO",
  planes:[],
  horarios:[]
};

const ConfigurarClaseList = () => {
  const [isVisible, setVisible] = useState(false); 
  const [defaultValues, setDefaultValues] = useState(initialDefaultValues); 
  const [data, setData] = useState({configuraciones: [], isFetching: false});

  useEffect(() => {
    const fetchConfiguraciones = async () => {
      try {
          setData({configuraciones: data.configuraciones, isFetching: true});
          const response = await service.getConfiguraciones();
          setData({configuraciones: response, isFetching: false});
      } catch (e) {
          console.log(e);
          setData({configuraciones: data.configuraciones, isFetching: false});
      }
    };
    fetchConfiguraciones();
  }, []);

  const fetchConfiguraciones = async () => {
    try {
        setData({configuraciones: data.configuraciones, isFetching: true});
        const response = await service.getConfiguraciones();
        setData({configuraciones: response, isFetching: false});
    } catch (e) {
        console.log(e);
        setData({configuraciones: data.configuraciones, isFetching: false});
    }
  };

  const handleEdit = async (row) => {
    try {
      console.log(row); 
      const configuracionClase = await service.getConfiguracionById(row.configuracionClaseId);
      console.log(configuracionClase); 
    
      await setDefaultValues({
        configuracionClaseId: configuracionClase.configuracionClaseId,
        nombre: configuracionClase.nombre,
        titulo: configuracionClase.titulo,
        fechaInicio:configuracionClase.fechaInicio,
        fechaFin:configuracionClase.fechaFin,
        dias: configuracionClase.dias,
        cantidadSocios: configuracionClase.cantidadSocios,
        cantidadSociosEspera:configuracionClase.cantidadSociosEspera,
        estado:configuracionClase.estado,
        planes: configuracionClase.planes,
        horarios:configuracionClase.horarios,
      })

      setVisible(true);
    } catch (e) {
      console.log(e);
    }
  }

  const handleRemove = async (row) => {
    try {
      const response = await service.changeStateConfiguracionById(row.configuracionClaseId, "INACTIVO");
      if (response.status === 'OK') {
        toast.success(response.message)
      }
      fetchConfiguraciones();
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
              <CardBody>
                <Table
                  tableHeaderColor="primary"
                  tableHead={["Nombre", "Título", "Fecha Inicio", "Fecha Fin", "Cantidad Socios", "Cantidad Lista Espera", "Estado", "Acciones"]}
                  tableData={data.configuraciones}
                  tableAction={[handleEdit, handleRemove]}
                  tableRowId="configuracionClaseId"
                />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
        </>
        ) : (<ConfigurarClaseCreate defaultValues={defaultValues} setVisible={setVisible} fetchConfiguraciones={fetchConfiguraciones} />)
      }
    </div>
  );
}

export default ConfigurarClaseList;