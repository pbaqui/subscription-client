import BackApi from 'apis/BackApi.js';
import qs from 'querystring';

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

const getUsuarios = async () => {
  const response = await BackApi.get(
    '/usuario', config2);

  return convertListaUsuario(response.data);
};

const getUsuarioDatos = async () => {
  const response = await BackApi.get(
    '/usuario-data', config2);

  return response.data;
};

const getUserDisponibleByCi = async (ci, reservas) => {
  const response = await BackApi.post(
    '/usuario-disponible', { ci:ci, reservas:reservas}, config2);
  return response.data;
};

const getUsuarioById = async (usuarioId) => {
  try {
    const response = await BackApi.get(
      '/usuario/'+ usuarioId,config2);
      
    return response.data;
  } catch (err) {
    return { status: 'ERR', message: err };
  }
};

const changeStateUsuarioById = async (usuarioId, estado) => {
  try {
    const response = await BackApi.post(
      '/usuario/state', {
        usuarioId : usuarioId,
        estado : estado
    }
    ,config2);
      
    return { status: 'OK', message: 'Usuario actualizado exitosamente'};
  } catch (err) {
    return { status: 'ERR', message: err };
  }
};

const convertListaUsuario = listaUsuarios => {
  const lista = listaUsuarios.map(item => ({
    usuarioId: item.usuarioId,
    nombre : item.nombre,
    apellido : item.apellido,
    email : item.email,
    telefono : item.telefono,
    estado: item.estado
  }));

  return lista;
};

const saveUsuario = async (usuario) => {
  try {
    const response = await BackApi.post(
      '/usuario', qs.stringify(usuario)
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
  getUsuarios : getUsuarios,
  saveUsuario : saveUsuario,
  getUsuarioById : getUsuarioById,
  changeStateUsuarioById: changeStateUsuarioById,
  getUsuarioDatos: getUsuarioDatos,
  getUserDisponibleByCi: getUserDisponibleByCi
}

