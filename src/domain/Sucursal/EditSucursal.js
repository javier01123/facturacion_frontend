import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios_instance from "../../services/httpClient/axios_instance";
import CustomSpinner from "../../components/CustomSpinner/CustomSpinner";
import NetworkError from "../../components/ErrorScreens/NetworkError/NetworkError";
import ValidationErrors from "../../components/ErrorScreens/ValidationErrors/ValidationErrors";
import { Form, Input, Button, Card, Row, Col } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import SucursalRepository from "./SucursalRepository";
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

const domicilioLayout = {
  labelCol: {
    span: 7,
  },
};

export default function EditSucursal() {
  const [sucursalState, setSucursalState] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [networkError, setNetworkError] = useState(null);
  const [validationErrors, setValidationErrors] = useState(null);
  const [isSubmiting, setIsSubmiting] = useState(false);

  let { id } = useParams();
  let history = useHistory();
  const sucursalId = id;
  const sucursalRepository = new SucursalRepository();
  const { addToast } = useToasts();

  const loadData = () => {
    axios_instance
      .get("/sucursal/" + sucursalId)
      .then((response) => {
        const sucursal = response.data;
        setSucursalState(sucursal);
      })
      .catch((error) => {
        setNetworkError(error);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect((sucursalId) => loadData(sucursalId), []);

  if (isLoading) {
    return <CustomSpinner />;
  }

  if (networkError) {
    return <NetworkError />;
  }

  const initialValues = sucursalState;

  const onFinishHandler = (values) => {
    const sucursalToPost = { id: sucursalId, ...values };
    setIsSubmiting(true);

    sucursalRepository
      .updateSucursal(sucursalToPost)
      .then((response) => {
        history.push("/sucursales");
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
      <Card
        style={{ backgroundColor: "white" }}
        title="Datos fiscales"
        bordered={true}
      >
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
