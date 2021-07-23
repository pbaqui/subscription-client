import BackApi from 'apis/BackApi.js';
import {dateFromDBToUI} from '../utils/index'

const config = {
  headers: {
    'Content-Type': 'application/json'
  }
}

const CLASS_PATH = "/configuracion-clase";

const getConfiguraciones = async (params) => {
  const response = await BackApi.get(
    CLASS_PATH, params, config);
  
  return convertToMap(response.data);
};

const getConfiguracionById = async (objectId) => {
  try {
    const response = await BackApi.get(
      CLASS_PATH + '/' + objectId, config);

    if (response.data.fechaInicio){
      response.data.fechaInicio = dateFromDBToUI(response.data.fechaInicio);
    }
    if (response.data.fechaFin){
      response.data.fechaFin = dateFromDBToUI(response.data.fechaFin);
    }
      
    return response.data;
  } catch (err) {
    return { status: 'ERR', message: err };
  }
};

const changeStateConfiguracionById = async (objectId, estado) => {
  try {
    const response = await BackApi.post(
      '/configuracion-clase/state', {
        configuracionClaseId : objectId,
        estado : estado
    }
    ,config);
    return { status: 'OK', message: 'Configuracion actualizada exitosamente'};
  } catch (err) {
    return { status: 'ERR', message: err };
  }
};

const convertToMap = lista => {
  const listaResult = lista.map(item => ({
    configuracionClaseId: item.configuracionClaseId,
    nombre : item.nombre,
    titulo : item.titulo,
    fechaInicio : item.fechaInicio,
    fechaFin : item.fechaFin,
    cantidadSocios : item.cantidadSocios,
    cantidadSociosEspera: item.cantidadSociosEspera,
    estado: item.estado
  }));

  return listaResult;
};

const saveConfiguracion = async (configuracion) => {
  console.log(configuracion)
  try {
    await BackApi.post(CLASS_PATH, configuracion, config);

    return { status: 'OK', message: 'Configuracion actualizada exitosamente' };
  } catch (error) {
    
    if (error.response) {
      return { status: 'ERR', message: error.response.data.error }
    }
    return { status: 'ERR', message: error };
  }
};

export default {
  getConfiguraciones : getConfiguraciones,
  saveConfiguracion : saveConfiguracion,
  getConfiguracionById : getConfiguracionById,
  changeStateConfiguracionById: changeStateConfiguracionById
}

