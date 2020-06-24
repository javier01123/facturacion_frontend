import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ValidationErrors from "../../components/ErrorScreens/ValidationErrors/ValidationErrors";
import { v4 as uuidv4 } from "uuid";
import { Form, Input, Button, Card } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import EmpresaRepository from "./EmpresaRepository";
import * as patterns from "../../utilities/regexPatterns";

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
  const empresaRepository = new EmpresaRepository();

  const onFinish = (values) => {
    const empresaToPost = {
      Id: uuidv4(),
      ...values,
    };

    setIsSubmiting(true);

    empresaRepository
      .createEmpresa(empresaToPost)
      .then((response) => {
        history.push("/empresas");
      })
      .catch((formatedError) => {
        if (formatedError.isValidationError === true) {
          setValidationErrors(formatedError.validationErrors);
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
              pattern:patterns.RFC,                
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
