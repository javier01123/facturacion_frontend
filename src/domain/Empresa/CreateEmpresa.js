import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios_instance from "../../services/httpClient/axios_instance";
import ValidationErrors from "../../components/ErrorScreens/ValidationErrors/ValidationErrors";
import { v4 as uuidv4 } from "uuid";
import { Form, Input, Button, Card, Row, Col } from "antd";
import { SaveOutlined } from "@ant-design/icons";

const layout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 5,
    span: 19,
  },
};
 


export default function CreateEmpresa() {
  const [validationErrors, setValidationErrors] = useState(null);
  const [isSubmiting, setIsSubmiting] = useState(false);

  let history = useHistory();
  const initialValues = {};

  const onFinish = (values) => {
    const empresaToPost = {
      Id: uuidv4(),
      ...values,
    };

    setIsSubmiting(true);

    axios_instance
      .post("/empresa", empresaToPost)
      .then((response) => {
        history.push("/empresas");
      })
      .catch((error) => {
        const response = error.response;
        if (response && response.status == 400) {
          const errorObject = response.data.errors;
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
      onFinish={onFinish}
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
            disabled={isSubmiting}
          >
            Registrar Empresa
          </Button>
        </Form.Item>
      </Card>
    </Form>
  );
}
