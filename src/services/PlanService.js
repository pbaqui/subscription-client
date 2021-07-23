import BackApi from 'apis/BackApi.js';

const CLASS_PATH = "/plan"
const config = {
  headers: {
    'Content-Type': 'application/json'
  }
}

const getPlanes = async (params) => {
    const response = await BackApi.get(
      CLASS_PATH, params, config);

    return convertListaPlan(response.data);
};

const getPlanById = async (id) => {
  try {
    const response = await BackApi.get(
      CLASS_PATH + '/'+ id, config);
      
    return response.data;
  } catch (err) {
    return { status: 'ERR', message: err };
  }
};

const changeStatePlanById = async (id, estado) => {
  try {
    const response = await BackApi.post(
      CLASS_PATH + '/state', {
        planId : id,
        estado : estado
    }
    ,config);
      
    return { status: 'OK', message: 'Usuario actualizado exitosamente'};
  } catch (err) {
    return { status: 'ERR', message: err };
  }
};

const convertListaPlan = listaPlan => {
  const lista = listaPlan.map(item => ({
    planId: item.planId,
    nombre : item.nombre,
    cantidadClases : item.cantidadClases,
    costo : item.costo,
    estado: item.estado
  }));

  return lista;
};

const savePlan = async (plan) => {
  console.log(plan)
  try {
    const response = await BackApi.post(
      CLASS_PATH, plan
      , config);

    return { status: 'OK', message: 'Plan actualizado exitosamente' };
  } catch (error) {
    
    if (error.response) {
      return { status: 'ERR', message: error.response.data.error }
    }
    return { status: 'ERR', message: error };
  }
};

export default {
  getPlanes : getPlanes,
  savePlan : savePlan,
  getPlanById : getPlanById,
  changeStatePlanById: changeStatePlanById
}

