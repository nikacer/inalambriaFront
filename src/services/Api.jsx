import axios from "axios";

const path = process.env.REACT_APP_API;

export function ObtenerEventos() {
  return axios.get(`${path}/eventos/all`);
}

export function guardarEvento(data) {
  return axios.post(`${path}/eventos/guardarEvento`, data);
}
export function eliminarEvento(id) {
  return axios.delete(`${path}/eventos/borrar/${id}`);
}

/**
 * funciones de las acciones de boleteria
 */

export function agregarBoleta(data) {
  return axios.post(`${path}/boleteria/guardar`, data);
}

export function eliminarBoleta(id) {
  return axios.delete(`${path}/boleteria/borrar/${id}`);
}

export function comprarBoleta(data) {
  return axios.post(`${path}/boleteria/vender`, data);
}
