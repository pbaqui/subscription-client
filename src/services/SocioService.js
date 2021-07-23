import BackApi from 'apis/BackApi.js';
import qs from 'querystring';
import {dateFromDBToUI} from '../utils/index'

const config = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
}

const config2 = {
  headers: {
    'Content-Type': 'application/json'
  }
}

const getSocios = async () => {
  try {
    const response = await BackApi.get(
      '/socio', config2);
    return convertListaSocio(response.data);
  } catch (err) {
    return { status: 'ERR', message: err };
  }
};

const getSocioById = async (usuarioId) => {
  try {
    const response = await BackApi.get(
      '/socio/'+ usuarioId,config2);
          
    if (response.data["usuario.fechaNacimiento"]){
      response.data["usuario.fechaNacimiento"] = dateFromDBToUI(response.data["usuario.fechaNacimiento"]);
    }

    return response.data;
  } catch (err) {
    return { status: 'ERR', message: err };
  }
};

const changeStateSocioById = async (usuarioId, estado) => {
  try {
    const response = await BackApi.post(
      '/socio/state', {
        usuarioId : usuarioId,
        estado : estado
    }
    ,config2);
      
    return { status: 'OK', message: 'Usuario actualizado exitosamente'};
  } catch (err) {
    return { status: 'ERR', message: err };
  }
};

const convertListaSocio = listaSocios => {
  const lista = listaSocios.map(item => ({
    usuarioId: item.usuarioId,
    nombre : item.usuario.nombre,
    apellido : item.usuario.apellido,
    email : item.usuario.email,
    telefono : item.usuario.telefono,
    ci : item.usuario.ci,
    estado: item.usuario.roles[0].usuario_rol.estado
  }));

  return lista;
};

const saveSocio = async (socio) => {
  try {
    socio.fechaNacimiento = socio.fechaNacimiento.toISOString();

    const response = await BackApi.post(
      '/socio', qs.stringify(socio)
      , config);

    return { status: 'OK', message: 'Usuario actualizado exitosamente' };
  } catch (error) {
    
    if (error.response) {
      return { status: 'ERR', message: error.response.data.error }
    }
    return { status: 'ERR', message: error };
  }
};

export default {
  getSocios : getSocios,
  saveSocio : saveSocio,
  getSocioById : getSocioById,
  changeStateSocioById: changeStateSocioById
}

