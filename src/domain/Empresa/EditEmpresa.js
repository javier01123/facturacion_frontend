import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import EmpresaRepository from "./EmpresaRepository";
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
  const empresaRepository = new EmpresaRepository();
  const { addToast } = useToasts();

  useEffect((empresaId) => loadData(empresaId), []);

  const loadData = () => {
    empresaRepository
      .getEmpresaById(empresaId)
      .then((empresa) => {
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
    const empresaToUpdate = { id: empresaId, ...values };
    setIsSubmiting(true);

    empresaRepository
      .updateEmpresa(empresaToUpdate)
      .then((response) => {
        // history.push("/empresas");
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
    <Form
      {...layout}
      name="basic"
      size="small"
      initialValues={initialValues}
      onFinish={onFinishHandler}
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
  );
}
