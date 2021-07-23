import BackApi from "apis/BackApi.js";
import { dateFromDBToUI } from "../utils/index";
import qs from 'querystring';

const BASE_PATH = "/periodo-socio";

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

const getPeriodos = async (ci, estado) => {
  let estados = [];

  if (estado) {
    estados = Object.keys(estado).filter((key) => {
      return estado[key] === true ? key : "";
    });
  }

  try {
    const response = await BackApi.get(BASE_PATH, {
      params: {
        ci: ci,
        estados: estados,
      }
    }, config);

    return convertLista(response.data);
  } catch (err) {
    return { status: "ERR", message: err };
  }
};

const getPeriodoById = async (id) => {
  try {
    const response = await BackApi.get(BASE_PATH + "/" + id, config);

    console.log(response);

    if (response.data && response.data.inicioVigencia) {
      response.data.inicioVigencia = dateFromDBToUI(
        response.data.inicioVigencia
      );
    }

    if (response.data && response.data.finVigencia) {
      response.data.finVigencia = dateFromDBToUI(response.data.finVigencia);
    }

    return response.data;
  } catch (err) {
    return { status: "ERR", message: err };
  }
};

const changeStatePeriodoById = async (usuarioId, estado) => {
  try {
    const response = await BackApi.post(
      BASE_PATH + "/state",
      {
        usuarioId: usuarioId,
        estado: estado,
      },
      config
    );

    return { status: "OK", message: "Usuario actualizado exitosamente" };
  } catch (err) {
    return { status: "ERR", message: err };
  }
};

const maintainPeriodById = async (periodoId, accion) => {
  console.log("periodoId: ", periodoId);
  console.log("accion: ", accion);
  try {
    const response = await BackApi.post(
      BASE_PATH + "/mantenimiento",
      {
        periodoId: periodoId,
        accion: accion,
      },
      config
    );

    return { status: "OK", message: "Periodo actualizado exitosamente" };
  } catch (err) {
    return { status: "ERR", message: err };
  }
};

const convertLista = (listaItems) => {
  const lista = listaItems.map((item) => ({
    periodoId: item.periodoId,
    inicioVigencia: item.inicioVigencia,
    finVigencia: item.finVigencia,
    estado: item.estado,
    nombre: item.usuario.nombre,
    apellido: item.usuario.apellido,
    ci: item.usuario.ci,
    plan: item.plan.nombre,
  }));

  return lista;
};

const savePeriodo = async (periodo) => {
  try {
    periodo.inicioVigencia = periodo.inicioVigencia.toISOString();
    periodo.finVigencia = periodo.finVigencia.toISOString();

    await BackApi.post(BASE_PATH, periodo, config);

    return { status: "OK", message: "Periodo actualizado exitosamente" };
  } catch (error) {
    console.log("error: ", error);

    if (error.response) {
      return { status: "ERR", message: error.response.data.error };
    }
    return { status: "ERR", message: error };
  }
};

export default {
  getPeriodos,
  savePeriodo,
  getPeriodoById,
  changeStatePeriodoById,
  maintainPeriodById,
};
