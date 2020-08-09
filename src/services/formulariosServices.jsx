/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, Fragment, useRef } from "react";
import { Form, Button } from "react-bootstrap";
import JoditEditor from "jodit-react";
import DatePicker from "react-datepicker";
import moment from "moment";

export function FormReactBoostrap(props) {
  const { data, onSubmit, idForm, id, edit, showButton, children } = props;
  const DOM = document.getElementById(idForm);
  const [editar, setEditar] = useState(edit);

  const editor = useRef(null);
  const [content, setContent] = useState({});

  const config = {
    readonly: false,
    uploader: {
      insertImageAsBase64URI: true,
    },
    language: "es",
  };

  useEffect(() => {
    resetDOM();
    let restrict = {};
    data.forEach((_) => {
      if (!content[_.name]) {
        restrict[_.name] = _.value;
      }
    });
    cambiarContent(restrict);
  }, [data]);

  useEffect(() => {
    setEditar(edit);
    resetDOM();
  }, [edit]);

  const cambiarContent = (data) => {
    if (Object.keys(data).length) {
      setContent(data);
    }
  };

  const resetDOM = () => {
    console.log(content);
    if (DOM) {
      DOM.reset();
    }
  };

  const CambiosContent = (item) => {
    const newContent = document.getElementById(`${item.name}_new`).value;
    cambiarContent({ ...content, [item.name]: newContent });
  };

  const propsDatePicker = {
    showTimeSelect: true,
    timeFormat: "hh:mm aa",
    timeIntervals: 15,
    timeCaption: "time",
    dateFormat: "dd/MM/yyyy h:mm aa",
    required: true,
  };

  return (
    <Fragment>
      <Form onSubmit={onSubmit} id={idForm} name={idForm}>
        {id !== "" && (
          <Form.Group controlId="id">
            <Form.Control type="hidden" value={id} />
          </Form.Group>
        )}
        {data.map((item, i) => (
          <Form.Group controlId={item.name} key={i}>
            {item.label && <Form.Label>{item.label}</Form.Label>}
            {item.type !== "textarea" &&
              item.type !== "select" &&
              item.type !== "dateTime" && (
                <Form.Control
                  type={item.type}
                  placeholder={item.placeholder}
                  defaultValue={item.value}
                  required={item.required}
                />
              )}
            {item.type === "textarea" && (
              <Fragment>
                <JoditEditor
                  ref={editor}
                  id={`${item.name}_new`}
                  value={content[item.name]}
                  config={config}
                  onBlur={() => CambiosContent(item)}
                />
                <Form.Control type="hidden" value={content[item.name]} />
              </Fragment>
            )}
            {item.type === "select" && (
              <Form.Control
                as="select"
                required={item.required}
                defaultValue={editar ? item.value : ""}
              >
                <option value="">{item.placeholder}</option>
                {item.select.map((opt) => (
                  <option value={opt.value}>{opt.label}</option>
                ))}
              </Form.Control>
            )}
            {item.type === "dateTime" && (
              <Fragment>
                <br />
                <DatePicker
                  className="form-control"
                  selected={
                    content[item.name]
                      ? new Date(content[item.name])
                      : new Date()
                  }
                  id={`${item.name}_new`}
                  onChange={(date) => {
                    if (date) {
                      cambiarContent({
                        ...content,
                        [item.name]: moment(date)
                          .format("YYYY-MM-DD HH:MM:SS")
                          .toString(),
                      });
                    }
                  }}
                  {...propsDatePicker}
                />
                <Form.Control type="hidden" value={content[item.name]} />
              </Fragment>
            )}

            {item.extra && (
              <Form.Text className="text-muted">{item.extra}</Form.Text>
            )}

            {item.isInvalid && (
              <Form.Control.Feedback type="invalid">
                {item.isInvalid}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        ))}
      </Form>
      {children}
      <br />
      {showButton && (
        <Button style={{ marginTop: " 30px" }} type="submit" form={idForm}>
          Enviar
        </Button>
      )}
    </Fragment>
  );
}
