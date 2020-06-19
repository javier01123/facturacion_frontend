import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios_instance from "../../services/httpClient/axios_instance";
import ValidationErrors from "../../components/ErrorScreens/ValidationErrors/ValidationErrors";
import { v4 as uuidv4 } from "uuid";
import { Form, Input, Button, Card, Row, Col } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import {useSelector} from 'react-redux';

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

export default function CreatCliente() {
  const [validationErrors, setValidationErrors] = useState(null);
  const [isSubmiting, setIsSubmiting] = useState(false);

  let history = useHistory();
  const initialValues = {};
  const empresaActualId = useSelector(state => state.empresaActualId);

  const onFinish = (values) => {
    const clienteToPost = {
      Id: uuidv4(),
      EmpresaId: empresaActualId,
      ...values,
    };

    setIsSubmiting(true);

    axios_instance
      .post("/cliente", clienteToPost)
      .then((response) => {
        history.push("/clientes");
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

      <Card>
        <Form.Item {...tailLayout}>
          <Button
            type="primary"
            htmlType="submit"
            size="middle"
            icon={<SaveOutlined />}
            disabled={isSubmiting}
          >
            Registrar Cliente
          </Button>
        </Form.Item>
      </Card>
    </Form>
  );
}
