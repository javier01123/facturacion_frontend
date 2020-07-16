import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ClienteRepository from "./../Cliente/ClienteRepository";
import EmpresaRepository from "./../Empresa/EmpresaRepository";
import CfdiRepository from "./CfdiRepository";
import CustomSpinner from "../../components/CustomSpinner/CustomSpinner";
import NetworkError from "../../components/ErrorScreens/NetworkError/NetworkError";
import ValidationErrors from "../../components/ErrorScreens/ValidationErrors/ValidationErrors";

import { useToasts } from "react-toast-notifications";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "react-redux";
import moment from "moment";
import PartidaEdit from "./PartidaEdit";
import * as renderers from "../../utilities/columnRederers";
import {
  Form,
  AutoComplete,
  DatePicker,
  Input,
  Table,
  Button,
  Card,
  message,
  Modal,
  Space,
  Select,
} from "antd";
import {
  SaveOutlined,
  EditTwoTone,
  PlusCircleTwoTone,
  DeleteTwoTone,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

const { Option } = AutoComplete;
const { confirm } = Modal;
// const { SelectOption } = Select;

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
    try {
      const cfdi = await cfdiRepository.getCfdiById(cfdiId);
      const empresa = await empresaRepository.getEmpresaById(empresaActualId);

      const offset = moment(cfdi.fechaEmision).utcOffset();
      cfdi.fechaEmision = moment(cfdi.fechaEmision).utc().add(offset, "minute");

      cfdi.partidas = cfdi.partidas.map((p) => {
        return { ...p, key: p.id };
      });
      setCfdiState(cfdi);
      setEmpresa(empresa);
    } catch (ex) {
      console.log(ex);
      setNetworkError(ex);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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

  const onDateChange = (momentObj, dateString) => {
    if (!momentObj) return;
    const offset = momentObj.utcOffset();
    momentObj = momentObj.utc().add(offset, "minute");
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
      partidas: cfdiState.partidas,
    };

    setIsSubmiting(true);

    cfdiRepository
      .updateCfdi(cfdiToPost)
      .then(async (response) => {
        await loadData();
        setModalPartidaVisible(false);
        message.success("cambios guardados", 0.8);
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
    setPartidaInitValues({ cantidad: "", valorUnitario: "", importe: "" });
    setIsPartidaNueva(true);
    setModalPartidaVisible(true);
  };

  const showEditarPartidaHandler = (partidaId) => {
    let partida = cfdiState.partidas.find((p) => p.id === partidaId);
    setIsPartidaNueva(false);
    setPartidaInitValues(partida);
    setModalPartidaVisible(true);
  };

  const cancelPartidaFormHandler = () => {
    setModalPartidaVisible(false);
  };

  const createPartidaColumn = (dataIndex, title, options = {}) => {
    return {
      key: dataIndex,
      dataIndex,
      title,
      ...options,
    };
  };
  const columns = [
    createPartidaColumn("descripcion", "Descripción"),
    createPartidaColumn("cantidad", "Cantidad"),
    createPartidaColumn("valorUnitario", "Valor Unitario", {
      isNumeric: true,
      render: renderers.numberRenderer,
    }),
    createPartidaColumn("importe", "Importe", {
      isNumeric: true,
      render: renderers.numberRenderer,
    }),
    {
      title: "",
      key: "acciones",
      render: (text, record) => {
        return (
          <Space size="small">
            <Button
              type="link"
              icon={<EditTwoTone />}
              onClick={() => showEditarPartidaHandler(record.id)}
            />
            <Button
              type="link"
              icon={<DeleteTwoTone />}
              onClick={() => confirmBorrarPartida(record)}
            />
          </Space>
        );
      },
    },
  ];

  const submitPartidaFormHandler = (formValues) => {
    if (isPartidaNueva === true) {
      const id = uuidv4();
      let newState = { ...cfdiState, partidas: [...cfdiState.partidas] };
      newState.partidas.push({ ...formValues, id: id, key: id });
      setCfdiState(newState);
      setModalPartidaVisible(false);
    } else {
      let newState = { ...cfdiState };
      let partida = newState.partidas.find((p) => p.id === formValues.id);
      partida.cantidad = formValues.cantidad;
      partida.valorUnitario = formValues.valorUnitario;
      partida.descripcion = formValues.descripcion;
      partida.importe = formValues.importe;
      setCfdiState(newState);
      setModalPartidaVisible(false);
    }
  };

  const confirmBorrarPartida = (partida) => {
    confirm({
      title: "Desea eliminar esta partida?",
      icon: <ExclamationCircleOutlined />,
      content: partida.descripcion,
      onOk() {
        let newState = { ...cfdiState, partidas: [...cfdiState.partidas] };
        newState.partidas = newState.partidas.filter(
          (p) => p.id !== partida.id
        );
        setCfdiState(newState);
      },
      onCancel() {},
    });
  };

  return (
    <React.Fragment>
      <Form
        name="basic"
        size="small"
        initialValues={initialValues}
        onFinish={onFinishHandler}
      >
        <Card type="inner" bordered={true}>
          <Form.Item name="id" style={{ display: "none" }}>
            <Input type="hidden" />
          </Form.Item>

          <div className="row">
            <div>
              <Button
                type="primary"
                htmlType="submit"
                size="middle"
                icon={<SaveOutlined />}
                disabled={isSubmiting}
              >
                Guardar Cambios
              </Button>
            </div>
          </div>

          <div className="row">
            <div className="column">
              <Form.Item label="Emisor" labelCol={{ span: 7 }}>
                <span className="ant-form-text">{empresa.razonSocial}</span>
                <br />
                <span>{empresa.rfc}</span>
              </Form.Item>
            </div>
            <div className="column">
              <Form.Item label="Folio" labelCol={{ span: 7 }}>
                <span className="ant-form-text">
                  {initialValues.serie} - {initialValues.folio}
                </span>
              </Form.Item>
            </div>
          </div>

          <div className="row">
            <div className="column">
              <Form.Item
                label="Cliente"
                name="razonSocialCliente"
                labelCol={{ span: 7 }}
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
            </div>
            <div className="column">
              <Form.Item
                label="Fecha de Emisión"
                name="fechaEmision"
                labelCol={{ span: 7 }}
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
                  onChange={onDateChange}
                />
              </Form.Item>
            </div>
          </div>

          <div className="row">
            <div className="column">
              <Form.Item
                label="Método de pago"
                name="metodoDePago"
                labelCol={{ span: 7 }}
                rules={[
                  {
                    required: true,
                    message: "obligatorio",
                  },
                ]}
              >
                <Select allowClear placeholder="seleccione una opción">
                  <Option value={1}>PUE - Pago en una sola exhibición</Option>
                  <Option value={2}>
                    PPD - Pago en parcialidades o diferido
                  </Option>
                </Select>
              </Form.Item>
            </div>
            <div className="column"></div>
          </div>

          <Table
            size="small"
            rowClassName={() => "editable-row"}
            bordered
            dataSource={cfdiState.partidas}
            columns={columns}
            pagination={false}
            showSorterTooltip={false}
          />
          <Button
            type="primary"
            htmlType="button"
            onClick={showAgregarPartidaHandler}
            style={{ float: "right" }}
            icon={<PlusCircleTwoTone />}
          >
            Agregar Partida
          </Button>
        </Card>

        {validationErrors ? (
          <ValidationErrors validationErrors={validationErrors} />
        ) : null}
      </Form>

      <Modal
        title="Partida"
        visible={modalPartidaVisible}
        onOk={modalPartidaOkHandler}
        onCancel={cancelPartidaFormHandler}
        footer={[
          <Button key="cancel" onClick={cancelPartidaFormHandler}>
            Cancel
          </Button>,
          <Button
            form="partidaform"
            key="submit"
            type="primary"
            htmlType="submit"
            loading={isSubmiting}
          >
            Submit
          </Button>,
        ]}
      >
        <PartidaEdit
          submitHandler={submitPartidaFormHandler}
          {...partidaInitValues}
        />
      </Modal>
    </React.Fragment>
  );
}
