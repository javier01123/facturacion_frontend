import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import ClienteRepository from "./ClienteRepository";
import ValidationErrors from "../../components/ErrorScreens/ValidationErrors/ValidationErrors";
import { v4 as uuidv4 } from "uuid";
import { Form, Input, Button, Card, Row, Col } from "antd";
import { SaveOutlined,ArrowLeftOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
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

const domicilioLayout = {
  labelCol: {
    span: 7,
  },
};

export default function CreateCliente() {
  const [validationErrors, setValidationErrors] = useState(null);
  const [isSubmiting, setIsSubmiting] = useState(false);

  let history = useHistory();
  const initialValues = {};
  const empresaActualId = useSelector((state) => state.empresaActualId);
  const clienteRepository = new ClienteRepository();
  const { addToast } = useToasts();
 

  const onFinish = (values) => {
    const clienteToPost = {
      Id: uuidv4(),
      EmpresaId: empresaActualId,
      ...values,
    };

    setIsSubmiting(true);

    let clienteCreated = false;

    clienteRepository
      .createCliente(clienteToPost)
      .then((response) => {
        clienteCreated = true;
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
        if (clienteCreated === true) history.push("/clientes");
      });
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
            <Link to="/clientes"> Regresar</Link>
          </Button>

          <Button
            type="primary"
            htmlType="submit"
            size="middle"
            icon={<SaveOutlined />}
            disabled={isSubmiting}
            style={{ margin: "5px 5px" }}
          >
            Registrar Cliente
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
          ]}
        >
          <Input />
        </Form.Item>
      </Card>

      <Card
        style={{ backgroundColor: "white" }}
        title="Domicilio"
        bordered={true}
      >
        <Row>
          <Col span={3}></Col>
          <Col span={8}>
            <Form.Item label="País" name="pais" {...domicilioLayout}>
              <Input />
            </Form.Item>
            <Form.Item label="Ciudad" name="ciudad" {...domicilioLayout}>
              <Input />
            </Form.Item>
            <Form.Item label="Colonia" name="colonia" {...domicilioLayout}>
              <Input />
            </Form.Item>
            <Form.Item label="Calle" name="calle" {...domicilioLayout}>
              <Input />
            </Form.Item>
            <Form.Item
              label="Núm. ext"
              name="numeroExterior"
              labelCol={{ span: 7 }}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Estado" name="estado" {...domicilioLayout}>
              <Input />
            </Form.Item>
            <Form.Item
              label="Municipio"
              name="municipio"
              labelCol={{ span: 7 }}
            >
              <Input />
            </Form.Item>
            <Form.Item label="CP" name="codigoPostal" {...domicilioLayout}>
              <Input />
            </Form.Item>
            <Form.Item />
            <Form.Item
              label="Núm. int"
              name="numeroInterior"
              {...domicilioLayout}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {validationErrors ? (
        <ValidationErrors validationErrors={validationErrors} />
      ) : null}

  
    </Form>
  );
}
