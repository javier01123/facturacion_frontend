import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import CfdiRepository from "./CfdiRepository";
import ValidationErrors from "../../components/ErrorScreens/ValidationErrors/ValidationErrors";
import { v4 as uuidv4 } from "uuid";
import { SaveOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import ClienteRepository from "./../Cliente/ClienteRepository";
import moment from "moment";
import {
  Form,
  AutoComplete,
  DatePicker,
  Input,
  InputNumber,
  Button,
  Card,
} from "antd";
import SucursalRepository from "../Sucursal/SucursalRepository";

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
  const initialValues = { serie: "F", fechaEmision: moment() };
  const empresaActualId = useSelector((state) => state.empresaActualId);
  const sucursalActualId = useSelector((state) => state.sucursalActualId);
  const cfdiRepository = new CfdiRepository();
  const clienteRepository = new ClienteRepository();
  const sucursalRepository = new SucursalRepository();
  const { addToast } = useToasts();
  const [form] = Form.useForm();

  const loadData = async () => {
    var siguienteFolio = await sucursalRepository.getSiguienteFolioDisponible(
      sucursalActualId
    );

    form.setFieldsValue({ folio: siguienteFolio });

    initialValues.folio = siguienteFolio;
  };

  useEffect(() => {
    loadData();
  }, []);

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
      sucursalId: sucursalActualId,
    };

    setIsSubmiting(true);
    let cfdiCreated = false;

    cfdiRepository
      .createCfdi(cfdiToPost)
      .then((response) => {
        cfdiCreated=true;
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
        if (cfdiCreated === true) history.push(`/cfdi/edit/${cfdiToPost.Id}`);
      });
  };

  return (
    <Form
      form={form}
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
            placeholder="Busque el cliente"
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
            format="DD-MM-YYYY HH:mm"
          />
        </Form.Item>
        <Form.Item
          label="Serie"
          name="serie"
          rules={[
            {
              type: "string",
            },
            {
              required: true,
              message: "obligatorio",
            },
            {
              max: 10,
              message: "longitud máxima 10",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Folio"
          name="folio"
          rules={[
            {
              required: true,
              message: "obligatorio",
            },
            {
              type: "number",
              message: "no es un número valido",
            },
          ]}
        >
          <InputNumber />
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
