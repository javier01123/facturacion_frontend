import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import ClienteRepository from "./ClienteRepository";
import CustomSpinner from "../../components/CustomSpinner/CustomSpinner";
import NetworkError from "../../components/ErrorScreens/NetworkError/NetworkError";
import ValidationErrors from "../../components/ErrorScreens/ValidationErrors/ValidationErrors";
import { Form, Input, Button, Card } from "antd";
import { SaveOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import * as patterns from "../../utilities/regexPatterns";
import { useToasts } from "react-toast-notifications";
import { Link } from "react-router-dom";

const layout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
  layout: "horizontal",
};

export default function EditCliente() {
  const [clienteState, setClienteState] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [networkError, setNetworkError] = useState(null);
  const [validationErrors, setValidationErrors] = useState(null);
  const [isSubmiting, setIsSubmiting] = useState(false);

  let { id } = useParams();
  let history = useHistory();
  const clienteId = id;
  const clienteRepository = new ClienteRepository();
  const { addToast } = useToasts();

  useEffect((clienteId) => loadData(clienteId), []);

  const loadData = () => {
    clienteRepository
      .getClienteById(clienteId)
      .then((cliente) => {
        setClienteState(cliente);
      })
      .catch((error) => {
        setNetworkError(error);
      })
      .finally(() => setIsLoading(false));
  };

  if (isLoading) {
    return <CustomSpinner />;
  }

  if (networkError) {
    return <NetworkError />;
  }

  const initialValues = clienteState;

  const onFinishHandler = (values) => {
    const clienteToPost = { id: clienteId, ...values };
    setIsSubmiting(true);

    clienteRepository
      .updateCliente(clienteToPost)
      .then((response) => {       
        addToast("cambios guardados", {
          appearance: "success",
          autoDismiss: true,
        });
      })
      .catch((error) => {
        if (error.isValidationError === true) {
          setValidationErrors(error.validationErrors);
        } else {
          addToast(error.message, { appearance: "error", autoDismiss: true });
        }
      })
      .finally(() => setIsSubmiting(false));
  };
  return (
    <React.Fragment>
      <Form
        {...layout}
        name="basic"
        size="small"
        initialValues={initialValues}
        onFinish={onFinishHandler}
      >
        <div>
          <Button type="default" size="middle" icon={<ArrowLeftOutlined />}>
            <Link to="/clientes"> Regresar</Link>
          </Button>

          <Button
            type="primary"
            htmlType="submit"
            size="middle"
            icon={<SaveOutlined />}
            loading={isSubmiting}
            style={{ margin: "5px 5px" }}
          >
            Guardar
          </Button>
        </div>
        <Card
          style={{ backgroundColor: "white" }}
          title="Datos fiscales"
          bordered={true}
        >
          <Form.Item
            label="Razón Social"
            name="razonSocial"
            normalize={(value) => (value || "").toUpperCase()}
            rules={[
              {
                required: true,
                whitespace: true,
                message: "obligatorio",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="RFC"
            name="rfc"
            rules={[
              {
                required: true,
                message: "obligatorio",
              },
              {
                pattern: patterns.RFC,
                message: "formato inválido",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Card>

        {validationErrors ? (
          <ValidationErrors validationErrors={validationErrors} />
        ) : null}
      </Form>
    </React.Fragment>
  );
}
