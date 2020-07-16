import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import SucursalRepository from "./SucursalRepository";
import ValidationErrors from "../../components/ErrorScreens/ValidationErrors/ValidationErrors";
import { v4 as uuidv4 } from "uuid";
import { Form, Input, Button, Card, Row, Col } from "antd";
import { SaveOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
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
 
const domicilioLayout = {
  labelCol: {
    span: 7,
  },
};

export default function CreateSucursal() {
  const [validationErrors, setValidationErrors] = useState(null);
  const [isSubmiting, setIsSubmiting] = useState(false);

  let history = useHistory();
  const initialValues = {};
  const empresaActualId = useSelector((state) => state.empresaActualId);
  const sucursalRepository = new SucursalRepository();
  const { addToast } = useToasts();

  const onFinish = (values) => {
    const sucursalToPost = {
      Id: uuidv4(),
      EmpresaId: empresaActualId,
      ...values,
    };

    setIsSubmiting(true);
    let sucursalCreated = false;

    sucursalRepository
      .createSucursal(sucursalToPost)
      .then((response) => {
        sucursalCreated = true;
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
        if (sucursalCreated === true) history.push("/sucursales");
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
          <Link to="/sucursales"> Regresar</Link>
        </Button>

        <Button
          type="primary"
          htmlType="submit"
          size="middle"
          icon={<SaveOutlined />}
          disabled={isSubmiting}
          style={{ margin: "5px 5px" }}
        >
          Registrar Sucursal
        </Button>
      </div>

      <Card style={{ backgroundColor: "white" }} title="Datos" bordered={true}>
        <Form.Item
          label="Nombre"
          name="nombre"
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
