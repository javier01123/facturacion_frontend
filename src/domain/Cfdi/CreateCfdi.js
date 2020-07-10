import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import CfdiRepository from "./CfdiRepository";
import ValidationErrors from "../../components/ErrorScreens/ValidationErrors/ValidationErrors";
import { v4 as uuidv4 } from "uuid";
import {
  Form,
  AutoComplete,
  DatePicker,
  Input,
  Button,
  Card,
  Row,
  Col,
} from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import * as patterns from "../../utilities/regexPatterns";
import { useToasts } from "react-toast-notifications";
import ClienteRepository from "./../Cliente/ClienteRepository";

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

const { Option } = AutoComplete;

export default function CreateCfdi() {
  const [validationErrors, setValidationErrors] = useState(null);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [result, setResult] = useState([]);
  const [clienteId, setClienteId] = useState();

  let history = useHistory();
  const initialValues = {};
  const empresaActualId = useSelector((state) => state.empresaActualId);
  const cfdiRepository = new CfdiRepository();
  const clienteRepository = new ClienteRepository();
  const { addToast } = useToasts();

  const handleSearch = async (value) => {
    let results = await clienteRepository.searchClientes(
      empresaActualId,
      value
    );

    setResult(results);
  };

  const onSelect = (val, option) => {
    setClienteId(option.key);
  };

  const onFinish = (values) => {
    const cfdiToPost = {
      ...values,
      Id: uuidv4(),
      clienteId: clienteId,
    };

    setIsSubmiting(true);

    cfdiRepository
      .createCfdi(cfdiToPost)
      .then((response) => {
        history.push(`/cfdi/edit/${cfdiToPost.Id}`);
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
      onFinish={onFinish}
    >
      <Card
        style={{ backgroundColor: "white" }}
        title="Datos fiscales"
        bordered={true}
      >
        <Form.Item
          label="Cliente"
          name="razonSocialCliente"
          rules={[
            {
              required: true,
              whitespace: true,
              message: "obligatorio",
            },
          ]}
        >
          <AutoComplete
            onSearch={handleSearch}
            onSelect={(val, option) => onSelect(val, option)}
            placeholder="Seleccione el cliente"
          >
            {result.map((cliente) => (
              <Option key={cliente.id} value={cliente.razonSocial}>
                {cliente.razonSocial}
              </Option>
            ))}
          </AutoComplete>
        </Form.Item>

        <Form.Item
          label="Fecha de Emisión"
          name="fechaEmision"
          rules={[
            {
              required: true,
              message: "obligatorio",
            },
          ]}
        >
          <DatePicker
            showTime={{ format: "HH:mm" }}
            format="YYYY-MM-DD HH:mm"
          />
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
            Crear Cfdi
          </Button>
        </Form.Item>
      </Card>
    </Form>
  );
}