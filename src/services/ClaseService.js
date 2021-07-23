import BackApi from 'apis/BackApi.js';
import auth from './AuthService'
import {timeFromDBToUI} from '../utils';

const config = {
  headers: {
    'Content-Type': 'application/json'
  }
}

const getClasesDisponibles = async () => {
  const response = await BackApi.get(
    "/clase-disponible", config);
  
    return {
            planes: response.data.planes ? convertToMapPlanes(response.data.planes) : null, 
            reservas : response.data.reservas,
            clases: response.data.clases ? convertToMapClase(response.data.clases) : null,
            clasesCoach: response.data.clasesCoach ? convertToClase(response.data.clasesCoach) : null,
          };
  };

const getReservasByUser = async () => {
  const usuario = auth.getUserAuthenticated();
  try {
    const response = await BackApi.get('reservas/' + usuario.user, config);
      
    return response.data;
  } catch (err) {
    return { status: 'ERR', message: err };
  }
};

const changeStateConfiguracionById = async (objectId, estado) => {
  try {
    await BackApi.post(
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

const convertToClase = item => {
  const itemResult = {
    claseId: item.claseId,
    nombre : item.nombre,
    fechaInicio : timeFromDBToUI(item.fechaInicio),
    fechaFin : timeFromDBToUI(item.fechaFin),
    fechaLimiteReserva : item.fechaLimiteReserva,
    onlyCancelarReserva : item.onlyCancelarReserva,
    fechaLimiteEliminarReserva : item.fechaLimiteEliminarReserva,
    cantidadMaxSocios : item.cantidadMaxSocios,
    cantidadSocios : item.cantidadSocios,
    cantidadMaxSociosEspera : item.cantidadMaxSociosEspera,
    cantidadReservas: item.cantidadReservas,
    planes: item.planes,
    coachId: item.coachId,
    asistenteId: item.asistenteId,
    estado: item.estado,
    reserva:item.reserva,
    reservaEstado:item.reservaEstado,
    socios: item.socios ? convertToMapSocio(item.socios) : null
  }
  return itemResult;
};

const convertToMapClase = lista => {
  console.log(lista);
  const listaResult = lista.map(item => (convertToClase(item)));
  return listaResult;
};

const convertToMapSocio = lista => {
  const listaResult = lista.map(item => ({
    usuarioId : item.usuarioId,
    nombre : item.nombre + " " + item.apellido,
    prueba : item.prueba,
    presente : item.presente
  }));
  return listaResult;
};

const convertToMapPlanes= lista => {
  const listaResult = lista.map(item => ({
    planId: item.planId,
    nombre : item.nombre,
    clasesPorDia : item.clasesPorDia,
    clases : convertToMapClase(item.clases)
  }));

  return listaResult;
};

//Realiza la reserva para el administrador y socio
const saveReserva = async (reserva, usuario) => {
  try {
    //Si el usuario es nulo, la reserva es del socio
    if (!usuario){
      //Asisgnar el usuario logueado
      usuario = auth.getUserAuthenticated().user;
    }
    await BackApi.post("clase-reserva", {reservas: reserva, usuario: usuario}, config);
  } catch (error) {
    if (error.response) {
      return { status: 'ERR', message: error.response.data.error }
    }
    return { status: 'ERR', message: error };
  }
  return { status: 'OK', message: 'Clase Reservada exitosamente' };
};

//Realiza la cancelacion de la reserva para el administrador (aun no) y socio
const cancelarReserva = async (claseId, usuario) => {
  try {
    //Si el usuario es nulo, la reserva es del socio
    if (!usuario){
      //Asisgnar el usuario logueado
      usuario = auth.getUserAuthenticated().user;
    }
    await BackApi.post("clase-cancelar-reserva", {claseId: claseId, usuario: usuario}, config);
  } catch (error) {
    if (error.response) {
      return { status: 'ERR', message: error.response.data.error }
    }
    return { status: 'ERR', message: error };
  }
  return { status: 'OK', message: 'Clase cancelada exitosamente' };
};

const saveAsistencia = async (asistencias, claseId) => {
  try {
    await BackApi.post("clase-asistencia", {asistencias: asistencias, claseId: claseId}, config);
  } catch (error) {
    if (error.response) {
      return { status: 'ERR', message: error.response.data.error }
    }
    return { status: 'ERR', message: error };
  }
  return { status: 'OK', message: 'Asistencia marcada exitosamente' };
};

export default {
  getClasesDisponibles : getClasesDisponibles,
  saveReserva : saveReserva,
  cancelarReserva: cancelarReserva,
  saveAsistencia : saveAsistencia,
  getReservasByUser : getReservasByUser,
  changeStateConfiguracionById: changeStateConfiguracionById
}

