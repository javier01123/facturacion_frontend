import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ValidationErrors from "../../components/ErrorScreens/ValidationErrors/ValidationErrors";
import { v4 as uuidv4 } from "uuid";
import { Form, Input, Button, Card } from "antd";
import { SaveOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import EmpresaRepository from "./EmpresaRepository";
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
};
const tailLayout = {
  wrapperCol: {
    offset: 5,
    span: 19,
  },
};

const CreateEmpresa = () => {
  const [validationErrors, setValidationErrors] = useState(null);
  const [isSubmiting, setIsSubmiting] = useState(false);

  let history = useHistory();
  const initialValues = {};
  const empresaRepository = new EmpresaRepository();
  const { addToast } = useToasts();

  const onFinish = (values) => {
    const empresaToPost = {
      Id: uuidv4(),
      ...values,
    };

    setIsSubmiting(true);
    let empresaCreated = false;

    empresaRepository
      .createEmpresa(empresaToPost)
      .then((response) => {
        empresaCreated = true;
      })
      .catch((error) => {
        if (error.isValidationError === true) {
          setValidationErrors(error.validationErrors);
        } else {
          addToast(error.message, { appearance: "error", autoDismiss: true });
        }
      })
      .finally(() => {
        setIsSubmiting(false);
        if (empresaCreated === true) history.push("/empresas");
      });
  };

  const isRfcDisponibleHandler = async (rule, value, callback) => {
    if (!value) {
      return;
    }

    if (value.length < 12 || value.length > 13) {
      return;
    }

    const result = await empresaRepository.isRfcDisponible(value);

    if (result === true) {
      callback();
    } else {
      throw new Error("RFC ya utilizado por otra empresa");
    }
  };

  return (
    <Form
      {...layout}
      name="basic"
      size="small"
      initialValues={initialValues}
      onFinish={onFinish}
    >
      <div>
        <Button type="default" size="middle" icon={<ArrowLeftOutlined />}>
          <Link to="/empresas"> Regresar</Link>
        </Button>

        <Button
          type="primary"
          htmlType="submit"
          size="middle"
          icon={<SaveOutlined />}
          disabled={isSubmiting}
          style={{ margin: "5px 5px" }}
        >
          Registrar Empresa
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
          normalize={(value) => (value || "").toUpperCase()}
          rules={[
            {
              required: true,
              message: "obligatorio",
            },
            {
              pattern: patterns.RFC,
              message: "formato inválido",
            },
            {
              validator: isRfcDisponibleHandler,
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
  );
};

export default CreateEmpresa;
