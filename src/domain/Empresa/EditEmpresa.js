import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios_instance from "../../services/httpClient/axios_instance";
import CustomSpinner from "../../components/CustomSpinner/CustomSpinner";
import NetworkError from "../../components/ErrorScreens/NetworkError/NetworkError";
import ValidationErrors from "../../components/ErrorScreens/ValidationErrors/ValidationErrors";
import { Form, Input, Button, Card, Row, Col } from "antd";
import { SaveOutlined } from "@ant-design/icons";

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

export default function EditEmpresa() {
  const [empresaState, setEmpresaState] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [networkError, setNetworkError] = useState(null);
  const [validationErrors, setValidationErrors] = useState(null);
  const [isSubmiting, setIsSubmiting] = useState(false);

  let { id } = useParams();
  let history = useHistory();
  const empresaId = id;

  useEffect((empresaId) => loadData(empresaId), []);

  const loadData = () => {
    axios_instance
      .get("/empresa/" + empresaId)
      .then((response) => {
        const empresa = response.data;
        setEmpresaState(empresa);
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

  const initialValues = empresaState;

  const onFinishHandler = (values) => {
    const empresaToPost = { id: empresaId, ...values };
    setIsSubmiting(true);

    axios_instance
      .put("/empresa", empresaToPost)
      .then((response) => {
        history.push("/empresas");
      })
      .catch((error) => {
        const response = error.response;
        if (response && response.status == 400) {
          const errorObject = response.data.errors;
          console.log({ errorObject });
          setValidationErrors(errorObject);
        } else {
          alert("Error al guardar los cambios, intente de nuevo");
        }
      })
      .finally(() => setIsSubmiting(false));
  };
  return (
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
          label="Nombre Comercial"
          name="nombreComercial"
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
              pattern:
                "^[A-Z&Ñ]{3,4}[0-9]{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])[A-Z0-9]{2}[0-9A]$",
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

      <Card>
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
    </Form>
  );
}
