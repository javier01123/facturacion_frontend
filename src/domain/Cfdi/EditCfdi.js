import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import CustomSpinner from "../../components/CustomSpinner/CustomSpinner";
import NetworkError from "../../components/ErrorScreens/NetworkError/NetworkError";
import ValidationErrors from "../../components/ErrorScreens/ValidationErrors/ValidationErrors";
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
import CfdiRepository from "./CfdiRepository";
import { useToasts } from "react-toast-notifications";
import ClienteRepository from "./../Cliente/ClienteRepository";
import { useSelector } from "react-redux";
import moment from "moment";

const { Option } = AutoComplete;

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

export default function EditCfdi() {
  const [cfdiState, setCfdiState] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [networkError, setNetworkError] = useState(null);
  const [validationErrors, setValidationErrors] = useState(null);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [searchClienteResult, setSearchClienteResult] = useState();

  let { id } = useParams();
  let history = useHistory();
  const cfdiId = id;
  const empresaActualId = useSelector((state) => state.empresaActualId);
  const cfdiRepository = new CfdiRepository();
  const clienteRepository = new ClienteRepository();
  const { addToast } = useToasts();

  const loadData = () => {
    cfdiRepository
      .getCfdiById(cfdiId)
      .then((response) => {
        response.fechaEmision = moment(response.fechaEmision);
        setCfdiState(response);
      })
      .catch((error) => {
        setNetworkError(error);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect((sucursalId) => loadData(sucursalId), []);

  const handleSearch = async (value) => {
    let results = await clienteRepository.searchClientes(
      empresaActualId,
      value
    );

    setSearchClienteResult(results);
  };

  const onSelect = (val, option) => {
    setCfdiState({ ...cfdiState, clienteId: option.key });
  };

  if (isLoading) {
    return <CustomSpinner />;
  }

  if (networkError) {
    return <NetworkError />;
  }

  const initialValues = cfdiState;

  const onFinishHandler = (values) => {

console.log({values});

    const cfdiToPost = {
      ...values,
      id: cfdiId,
      clienteId: cfdiState.clienteId,
    };

    setIsSubmiting(true);

    cfdiRepository
      .updateCfdi(cfdiToPost)
      .then((response) => {
        history.push("/cfdi");
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
            {searchClienteResult &&
              searchClienteResult.map((cliente) => (
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
            Guardar Cambios
          </Button>
        </Form.Item>
      </Card>
    </Form>
  );
}
