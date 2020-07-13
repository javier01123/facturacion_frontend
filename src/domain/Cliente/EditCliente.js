import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import ClienteRepository from "./ClienteRepository";
import CustomSpinner from "../../components/CustomSpinner/CustomSpinner";
import NetworkError from "../../components/ErrorScreens/NetworkError/NetworkError";
import ValidationErrors from "../../components/ErrorScreens/ValidationErrors/ValidationErrors";
import { Form, Input, Button, Card } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import * as patterns from "../../utilities/regexPatterns";
import { useToasts } from "react-toast-notifications";

const layout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
  layout: "horizontal",
};
const tailLayout = {
  wrapperCol: {
    offset: 5,
    span: 19,
  },
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
  const {addToast}= useToasts();

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
        history.push("/clientes");
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

          <Form.Item {...tailLayout}>
            <Button
              type="primary"
              htmlType="submit"
              size="middle"
              icon={<SaveOutlined />}
              disabled={isLoading || isSubmiting}
            >
              Guardar Cambios
            </Button>
          </Form.Item>
        </Card>

        {validationErrors ? (
          <ValidationErrors validationErrors={validationErrors} />
        ) : null}
      </Form>
    </React.Fragment>
  );
}
