import React, { useEffect, useState, Fragment } from "react";
import { Row, Col, Modal, Button, Table } from "react-bootstrap";
import {
  ObtenerEventos,
  guardarEvento as gE,
  eliminarEvento,
  agregarBoleta,
  eliminarBoleta,
  comprarBoleta,
} from "../../services/Api";
import { Card, message, Row as R, Col as C, Popconfirm } from "antd";
import moment from "moment";

import { FormReactBoostrap } from "../../services/formulariosServices";

import { construirObjeto } from "../../services/util";
import "./Eventos.scss";

import more from "../../assets/img/plus.svg";
import edit from "../../assets/img/002-pencil.svg";
import del from "../../assets/img/001-delete.svg";
import ver from "../../assets/img/eye.svg";
import pay from "../../assets/img/pay.svg";

export default function Eventos() {
  const initDataEvento = {
    nombre: "",
    descripcion: "",
    fechaInicio: moment(new Date()).toString(),
    fechaFin: moment(new Date()).add(1, "hours").toString(),
    id: "",
  };

  const initDataBoleteria = {
    nombre: "",
    idEvento: "",
    stock: 0,
    percio: 0,
    id: "",
  };

  const [eventos, seteventos] = useState([]);
  const [boletas, setBoletas] = useState({
    data: [],
    event: "",
  });
  const [modal, setModal] = useState({
    visible: false,
    edit: false,
    edita: false,
    data: initDataEvento,
    form: "evento",
  });

  const obtenerData = () => {
    ObtenerEventos().then((resp) => {
      if (resp.data.eventos && resp.data.eventos.length > 0)
        seteventos(resp.data.eventos);
      if (resp.data.boleteria && resp.data.boleteria.length > 0)
        setBoletas({ ...boletas, data: resp.data.boleteria });
    });
  };

  const guardarEvento = (event) => {
    event.preventDefault();
    const response = construirObjeto("evento");

    gE({
      ...response,
      fechaInicio: moment(response.fechaInicio).format("YYYY-MM-DD HH:MM:SS"),
      fechaFin: moment(response.fechaFin).format("YYYY-MM-DD HH:MM:SS"),
    }).then((res) => {
      if (res.data.save) {
        setModal({
          visible: false,
          data: initDataEvento,
          edit: false,
          form: "evento",
        });
        obtenerData();
        message.success("Se a guardado correctamente");
      } else {
        message.error(
          "No fue posible guardar en este momento por favor intenta mas tarde"
        );
      }
    });
  };

  const eliminarEve = (id) => {
    eliminarEvento(id).then((resp) => {
      if (resp.data.del) {
        obtenerData();
        message.success("Se a eliminado correctamente");
      } else {
        message.error(
          "No fue posible guardar en este momento por favor intenta mas tarde"
        );
      }
    });
  };

  const guardarBoleta = (event) => {
    event.preventDefault();
    const response = construirObjeto("boleta");
    agregarBoleta(response).then((res) => {
      if (res.data.save) {
        obtenerData();
        message.success("Se a guardado correctamente");
        setModal({
          visible: false,
          data: initDataEvento,
          edit: false,
          form: "evento",
        });
      } else {
        message.error(
          "No fue posible guardar en este momento por favor intenta mas tarde"
        );
      }
    });
  };

  const eliminarBo = (id) => {
    eliminarBoleta(id).then((resp) => {
      if (resp.data.del) {
        obtenerData();
        message.success("Se a eliminado correctamente");
      } else {
        message.error(
          "No fue posible guardar en este momento por favor intenta mas tarde"
        );
      }
    });
  };

  const accionesModal = (form, data, edit) => {
    setModal({ visible: true, data, form, edit });
  };

  const comprarBo = (boleta) => {
    const { id, idEvento, stock, vendidas } = boleta;
    if (stock > vendidas) {
      comprarBoleta({
        idBoleta: id,
        idEvento,
      }).then((resp) => {
        if (resp.data.vender) {
          obtenerData();
          message.success("Se a vendido :)");
        }
      });
    } else {
      message.warning("No te queda stock para vender esta boleta");
    }
    console.log("comprar boleta clik", boleta);
  };

  const contruirVistaBoletas = () => {
    return (
      <Fragment>
        <h1>Vista boletas</h1>
        {boletas.event && boletas.data && boletas.data.length > 0 && (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Stock / vendidas</th>
                <th>Precio</th>
                <th>acciones</th>
              </tr>
            </thead>
            <tbody>
              {boletas.data.map((boleta) => {
                if (boleta.idEvento === boletas.event) {
                  return (
                    <tr>
                      <td>{boleta.nombre}</td>
                      <td>
                        {boleta.stock} / {boleta.vendidas}
                      </td>
                      <td>{boleta.precio}</td>
                      <td>
                        <ul className="accione">
                          <li
                            onClick={() =>
                              accionesModal("boleta", boleta, true)
                            }
                          >
                            <img src={edit} alt="editar boleta" />
                          </li>
                          <li>
                            <Popconfirm
                              title="¿Seguro quiere borrar la boleta?"
                              onConfirm={() => eliminarBo(boleta.id)}
                              okText="Si"
                              cancelText="No"
                            >
                              <img src={del} alt="eliminar boleta" />
                            </Popconfirm>
                          </li>
                          <li onClick={() => comprarBo(boleta)}>
                            <img src={pay} alt="comprar boleta" />
                          </li>
                        </ul>
                      </td>
                    </tr>
                  );
                }
              })}
            </tbody>
          </Table>
        )}
      </Fragment>
    );
  };

  const formEvento = [
    {
      name: "nombre",
      isInvalid: "El titulo es obligatorio",
      required: true,
      label: "Titulo:",
      placeholder: "Ingrese un titulo",
      type: "text",
      value: modal.data.nombre ? modal.data.nombre : "",
    },
    {
      name: "descripcion",
      label: "Descripción:",
      required: true,
      placeholder: "Ingrese descripción",
      value: modal.data.descripcion ? modal.data.descripcion : "",
      type: "textarea",
    },
    {
      name: "fechaInicio",
      label: "Fecha inicio:",
      required: true,
      placeholder: "Ingrese fecha de inicio",
      value: modal.data.fechaInicio
        ? modal.data.fechaInicio
        : initDataEvento.fechaInicio,
      type: "dateTime",
    },
    {
      name: "fechaFin",
      label: "Fecha cierre:",
      required: true,
      placeholder: "Ingrese fecha de cierre",
      value: modal.data.fechaFin
        ? modal.data.fechaFin
        : initDataEvento.fechaFin,
      type: "dateTime",
    },
  ];

  const formBoleta = [
    {
      name: "nombre",
      isInvalid: "El nombre es obligatorio",
      required: true,
      label: "Titulo:",
      placeholder: "Ingrese un nombre",
      type: "text",
      value: modal.data.nombre ? modal.data.nombre : "",
    },
    {
      name: "idEvento",
      isInvalid: "",
      required: true,
      placeholder: "idEvento",
      type: "hidden",
      value: modal.data.idEvento,
    },
    {
      name: "stock",
      isInvalid: "Numero de boletas disponibles",
      required: true,
      label: "Stock disponible:",
      placeholder: "Ingrese numero",
      type: "number",
      value: modal.data.stock ? modal.data.stock : 15,
    },
    {
      name: "precio",
      isInvalid: "costo no es valido",
      required: true,
      label: "costo por boleta:",
      placeholder: "Ingrese costo",
      type: "number",
      value: modal.data.precio ? modal.data.precio : 0,
      extra: "Si deja 0 sera gratuíta",
    },
  ];

  const form = {
    evento: (
      <FormReactBoostrap
        data={formEvento}
        onSubmit={guardarEvento}
        idForm="evento"
        id={modal.data.id}
        editar={modal.edit}
      />
    ),
    boleta: (
      <FormReactBoostrap
        data={formBoleta}
        onSubmit={guardarBoleta}
        idForm="boleta"
        id={modal.data.id}
        editar={modal.edit}
      />
    ),
  };

  useEffect(() => {
    obtenerData();
  }, []);

  useEffect(() => {
    console.log(modal);
  }, [modal]);

  return (
    <Fragment>
      <Row>
        <Col md={8} lg={8} xs={12}>
          <h1>Eventos</h1>
          {eventos.length > 0 && (
            <R gutter={16}>
              {eventos.map((evento, i) => (
                <C span={8} key={i}>
                  <Card
                    title={evento.nombre}
                    size="default"
                    extra={
                      <ul class="accione">
                        <li
                          onClick={() => accionesModal("evento", evento, true)}
                        >
                          <img src={edit} alt="editar evento" width="35" />
                        </li>
                        <li>
                          <Popconfirm
                            title="¿Seguro quiere borrar el evento y sus boletas?"
                            onConfirm={() => eliminarEve(evento.id)}
                            okText="Si"
                            cancelText="No"
                          >
                            <img src={del} alt="eliminar evento" width="35" />
                          </Popconfirm>
                        </li>
                      </ul>
                    }
                    style={{ width: "300px", float: "left" }}
                  >
                    <p
                      dangerouslySetInnerHTML={{ __html: evento.descripcion }}
                    ></p>
                    <p>
                      <b>fecha de inicio: </b>
                      {moment(evento.fechaInicio).format(
                        "DD/MM/YYYY, h:mm:ss a"
                      )}
                    </p>
                    <p>
                      <b>fecha de Fin: </b>
                      {moment
                        .utc(evento.fechaFin)
                        .format("DD/MM/YYYY, h:mm:ss a")}
                    </p>
                    <p>
                      <ul className="accione" style={{ paddingLeft: 0 }}>
                        <li>
                          <b>Boleteria: </b> {` ( ${evento.boleteria} )`}
                        </li>
                        {evento.boleteria != 0 && (
                          <li
                            onClick={() =>
                              setBoletas({ ...boletas, event: evento.id })
                            }
                          >
                            <img src={ver} alt="Ver boletas" />
                          </li>
                        )}
                        <li
                          onClick={() =>
                            accionesModal(
                              "boleta",
                              { ...initDataBoleteria, idEvento: evento.id },
                              false
                            )
                          }
                        >
                          <img src={more} alt="agregar boleta" />
                        </li>
                      </ul>
                    </p>
                  </Card>
                </C>
              ))}
            </R>
          )}
        </Col>
        <Col md={4} lg={4} xs={12}>
          {contruirVistaBoletas()}
        </Col>
      </Row>

      <div
        className="agregarEvento"
        onClick={() => accionesModal("evento", initDataEvento, false)}
      >
        <img src={more} alt="" />
      </div>

      <Modal
        show={modal.visible}
        onHide={() => setModal({ ...modal, visible: false })}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {modal.data.form !== "evento" ? "Acción Evento" : "Acción Boleta"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{form[modal.form]}</Modal.Body>
        <Modal.Footer>
          <Button type="submit" variant="primary" form={modal.form}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
}
