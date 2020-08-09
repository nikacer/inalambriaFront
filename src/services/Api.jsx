import axios from "axios";

const path = process.env.REACT_APP_API;

export function ObtenerEventos() {
  return axios.get(`${path}/eventos/all`);
}

export function guardarEvento(data) {
  return axios.post(`${path}/eventos/guardarEvento`, data);
}
export function eliminarEvento(id) {
  const options = {
    data: {
      id,
    },
  };
  return axios.delete(`${path}/eventos/del`, options);
}
