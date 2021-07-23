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

const getCoaches = async () => {
  const response = await BackApi.get(
    '/coach', config2);

  return convertCoach(response.data);
};

const getCoachesList = async (params) => {
  const response = await BackApi.get(
    '/coach-list', params, config2);

  return convertListaCoach(response.data);
};

const getCoachById = async (usuarioId) => {
  try {
    const response = await BackApi.get(
      '/coach/'+ usuarioId,config2);

    if (response.data && response.data.usuario.fechaNacimiento){
      response.data.usuario.fechaNacimiento= dateFromDBToUI(response.data.usuario.fechaNacimiento);
    }
  
    return response.data;
  } catch (err) {
    return { status: 'ERR', message: err };
  }
};

const changeStateCoachById = async (usuarioId, estado) => {
  try {
    const response = await BackApi.post(
      '/coach/state', {
        usuarioId : usuarioId,
        estado : estado
    }
    ,config2);
      
    return { status: 'OK', message: 'Usuario actualizado exitosamente'};
  } catch (err) {
    return { status: 'ERR', message: err };
  }
};

const convertListaCoach = listaSocios => {
  const object = listaSocios.reduce(
    (obj, item) => Object.assign(obj, { [item.usuario_id]: item.nombre }), {});
  
  return object;
};

const convertCoach = listaSocios => {
  const lista = listaSocios.map(item => ({
    usuarioId: item.usuarioId,
    nombre : item.usuario.nombre,
    apellido : item.usuario.apellido,
    email : item.usuario.email,
    telefono : item.usuario.telefono,
    tipo: item.tipo,
    estado: item.usuario.roles[0].usuario_rol.estado
  }));

  return lista;
};

const saveCoach = async (coach) => {
  coach.fechaNacimiento = coach.fechaNacimiento.toISOString();
  try {
    const response = await BackApi.post(
      '/coach', qs.stringify(coach)
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
  getCoaches : getCoaches,
  getCoachesList : getCoachesList,
  saveCoach : saveCoach,
  getCoachById : getCoachById,
  changeStateCoachById: changeStateCoachById
}

