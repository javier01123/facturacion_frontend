import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ClienteRepository from "./../Cliente/ClienteRepository";
import EmpresaRepository from "./../Empresa/EmpresaRepository";
import CfdiRepository from "./CfdiRepository";
import CustomSpinner from "../../components/CustomSpinner/CustomSpinner";
import NetworkError from "../../components/ErrorScreens/NetworkError/NetworkError";
import ValidationErrors from "../../components/ErrorScreens/ValidationErrors/ValidationErrors";
import { SaveOutlined } from "@ant-design/icons";
import { useToasts } from "react-toast-notifications";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "react-redux";
import moment from "moment";
import { createColumn } from "../../utilities/tableUtils";
import {
  Form,
  AutoComplete,
  DatePicker,
  Input,
  InputNumber,
  Table,
  Button,
  Card,
  Divider,
  message,
  Modal,
  Space,
} from "antd";

const { Option } = AutoComplete;

export default function EditCfdi() {
  const [cfdiState, setCfdiState] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [networkError, setNetworkError] = useState(null);
  const [validationErrors, setValidationErrors] = useState(null);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [searchClienteResult, setSearchClienteResult] = useState();
  const [empresa, setEmpresa] = useState();
  const [modalPartidaVisible, setModalPartidaVisible] = useState();
  const [partidaInitValues, setPartidaInitValues] = useState();
  const [isPartidaNueva, setIsPartidaNueva] = useState();

  let { id } = useParams();
  const { addToast } = useToasts();

  const cfdiId = id;
  const empresaActualId = useSelector((state) => state.empresaActualId);
  const cfdiRepository = new CfdiRepository();
  const clienteRepository = new ClienteRepository();
  const empresaRepository = new EmpresaRepository();

  const loadData = async () => {
    // cfdiRepository
    //   .getCfdiById(cfdiId)
    //   .then((response) => {
    //     response.fechaEmision = moment(response.fechaEmision);
    //     setCfdiState(response);
    //   })
    //   .catch((error) => {
    //     setNetworkError(error);
    //   })
    //   .finally(() => setIsLoading(false));

    const cfdi = await cfdiRepository.getCfdiById(cfdiId);
    const empresa = await empresaRepository.getEmpresaById(empresaActualId);
    cfdi.fechaEmision = moment(cfdi.fechaEmision);

    setCfdiState(cfdi);
    setEmpresa(empresa);
    setIsLoading(false);
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
    console.log({ values });

    const cfdiToPost = {
      ...values,
      clienteId: cfdiState.clienteId,
    };

    setIsSubmiting(true);

    cfdiRepository
      .updateCfdi(cfdiToPost)
      .then((response) => {
        message.success("cambios guardados exitosamente!", 0.8);
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
      });
  };

  const modalPartidaOkHandler = () => {
    setModalPartidaVisible(false);
  };

  const showAgregarPartidaHandler = () => {
    setIsPartidaNueva(true);
    setPartidaInitValues({});
    setModalPartidaVisible(true);
  };

  const showEditarPartidaHandler = (partidaId) => {
    let partida = cfdiState.partidas.find((p) => p.Id === partidaId);
    setPartidaInitValues(partida);
    setIsPartidaNueva(false);
    setModalPartidaVisible(true);
  };

  const cancelPartidaFormHandler = () => {
    setModalPartidaVisible(false);
  };

  const submitPartidaFormHandler = (formValues) => {
    if (isPartidaNueva === true) {
      cfdiRepository
        .agregarPartida(cfdiId, { ...formValues, Id: uuidv4() })
        .then((response) => {
          message.success("partida agregada");
          setModalPartidaVisible(false);
        })
        .catch((error) => {});
    } else {
      cfdiRepository
        .updatePartida(cfdiId, formValues)
        .then((response) => {
          message.success("partida modificada");
          setModalPartidaVisible(false);
        })
        .catch((error) => {});
    }
  };

  const columns = [
    createColumn("descripcion", "Descripción", {}),
    createColumn("cantidad", "Cantidad", { isNumeric: true }),
    createColumn("valorUnitario", "Valor Unitario", { isNumeric: true }),
    createColumn("importe", "Importe", { isNumeric: true }),
    {
      title: "acciones",
      key: "acciones",
      render: (text, record) => {
        return (
          <Space size="small">
            <Button onClick={() => showEditarPartidaHandler(record.Id)}>
              Editar
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <React.Fragment>
      <Form
        name="basic"
        size="small"
        initialValues={initialValues}
        onFinish={onFinishHandler}
      >
        <Card
          // style={{ backgroundColor: "white" }}
          // title="Generar CFDI"
          bordered={true}
        >
          <Form.Item name="id">
            <Input type="hidden" />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="middle"
            icon={<SaveOutlined />}
            disabled={isSubmiting}
          >
            Guardar Cambios
          </Button>
          <Divider orientation="left">Emisor</Divider>

          <p>Razón Social: {empresa.razonSocial} </p>
          <p>R.F.C: {empresa.rfc} </p>

          <Divider orientation="left">Datos Fiscales</Divider>
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

          <Divider orientation="left">Cliente</Divider>

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

          <Divider orientation="left">Partidas</Divider>
          <Button
            type="primary"
            htmlType="button"
            onClick={showAgregarPartidaHandler}
          >
            Agregar Partida
          </Button>
          <Table
            // components={components}
            rowClassName={() => "editable-row"}
            bordered
            dataSource={cfdiState.partidas}
            columns={columns}
          />
        </Card>

        {validationErrors ? (
          <ValidationErrors validationErrors={validationErrors} />
        ) : null}
      </Form>

      <Modal
        title="Partida"
        visible={modalPartidaVisible}
        onOk={modalPartidaOkHandler}
        // confirmLoading={confirmLoading}
        // onCancel={cancelPartidaFormHandler}
        footer={[
          <Button key="cancel" onClick={cancelPartidaFormHandler}>
            Cancel
          </Button>,
          <Button
            form="partidaform"
            key="submit"
            type="primary"
            htmlType="submit"
            // loading={loading}
          >
            Submit
          </Button>,
        ]}
      >
        <Form
          id="partidaform"
          name="basic"
          size="small"
          onFinish={submitPartidaFormHandler}
          initialValues={partidaInitValues}
        >
          <Form.Item name="id">
            <Input type="hidden" />
          </Form.Item>

          <Form.Item
            label="Descripción"
            name="descripcion"
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
            label="Cantidad"
            name="cantidad"
            min={0}
            step={1}
            rules={[
              {
                required: true,
                message: "obligatorio",
              },
            ]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            label="Valor Unitario"
            name="valorUnitario"
            min={0}
            rules={[
              {
                required: true,
                message: "obligatorio",
              },
            ]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item label="Importe" name="importe">
            <InputNumber readOnly disabled />
          </Form.Item>

          {/* <Button htmlType="submit">Guardar</Button> */}
        </Form>
      </Modal>
    </React.Fragment>
  );
}
