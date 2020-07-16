import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import CfdiRepository from "./CfdiRepository";
import ValidationErrors from "../../components/ErrorScreens/ValidationErrors/ValidationErrors";
import { v4 as uuidv4 } from "uuid";
import { SaveOutlined,ArrowLeftOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import ClienteRepository from "./../Cliente/ClienteRepository";
import moment from "moment";
import SucursalRepository from "../Sucursal/SucursalRepository";
import { Link } from "react-router-dom";
import {
  Form,
  Select,
  DatePicker,
  Input,
  InputNumber,
  Button,
  Card,
} from "antd";

const layout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};
 

const { Option } = Select;

export default function CreateCfdi() {
  const [validationErrors, setValidationErrors] = useState(null);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [result, setResult] = useState([]);
  // const [clienteId, setClienteId] = useState();

  let history = useHistory();
  const offset = moment().utcOffset();
  let fecha = moment().utc().add(offset, "minute");

  const initialValues = {
    serie: "F",
    fechaEmision: fecha,
  };
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
 
  const onFinish = (values) => {
    const cfdiToPost = {
      ...values,
      Id: uuidv4(),
      sucursalId: sucursalActualId,
    };

    setIsSubmiting(true);
    let cfdiCreated = false;

    cfdiRepository
      .createCfdi(cfdiToPost)
      .then((response) => {
        cfdiCreated = true;
        addToast("CFDI creado", { appearance: "success", autoDismiss: true });
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

  const valuesChangedHandler = (formValues) => console.log({ formValues });

  const onDateChange = (momentObj, dateString) => {
    if (!momentObj) return;

    const offset = momentObj.utcOffset();
    momentObj = momentObj.utc().add(offset, "minute");
  };

  return (
    <Form
      onValuesChange={valuesChangedHandler}
      form={form}
      {...layout}
      name="basic"
      size="small"
      initialValues={initialValues}
      onFinish={onFinish}
    >

<div>
          <Button type="default" size="middle" icon={<ArrowLeftOutlined />}>
            <Link to="/cfdi"> Regresar</Link>
          </Button>

          <Button
            type="primary"
            htmlType="submit"
            size="middle"
            icon={<SaveOutlined />}
            disabled={isSubmiting}
            style={{ margin: "5px 5px" }}
          >
            Crear Cfdi
          </Button>
        </div>
      <Card
        style={{ backgroundColor: "white" }}
        title="Datos fiscales"
        bordered={true}
      >
        <Form.Item
          label="Cliente"
          name="clienteId"
          rules={[
            {
              required: true,
              whitespace: true,
              message: "obligatorio",
            },
          ]}
        > 
          <Select
            allowClear
            showSearch
            onSearch={handleSearch}          
            placeholder="Busque el cliente"
          >
            {result.map((cliente) => (
              <Option key={cliente.id} value={cliente.id}>
                {cliente.razonSocial}
              </Option>
            ))}
          </Select>
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
            onChange={onDateChange}
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
          <InputNumber   disabled/>
        </Form.Item>
      </Card>

      {validationErrors ? (
        <ValidationErrors validationErrors={validationErrors} />
      ) : null}
    
    </Form>
  );
}
