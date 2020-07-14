import React, { useState, useEffect, Fragment } from "react";
import ClienteRepository from "./ClienteRepository";
import { useHistory } from "react-router-dom";
import CustomSpinner from "../../components/CustomSpinner/CustomSpinner";
import NetworkError from "../../components/ErrorScreens/NetworkError/NetworkError";
import { Table, Button, Input, Row, Col } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import {
  createColumn,
  createEditarColumn,
  search,
} from "../../utilities/tableUtils";

const columns = [
  createColumn("razonSocial", "Razón social"),
  createColumn("rfc", "RFC"),
  createEditarColumn("Editar", "editar", "/clientes/edit/"),
];

export default function CatalogoClientes() {
  const [clientes, setClientes] = useState(null);
  const [networkError, setNetworkError] = useState(null);
  const [filteredData, setFilteredData] = useState(null);

  const empresaActualId = useSelector((state) => state.empresaActualId);
  let history = useHistory();
  const clienteRepository = new ClienteRepository();

  const getClientes = () => {
    clienteRepository
      .getClientes(empresaActualId)
      .then((clientes) => {
        setClientes(clientes);
      })
      .catch((error) => {
        setNetworkError(error);
      });
  };

  const addClienteHandler = () => {
    history.push("/clientes/create");
  };

  useEffect(getClientes, []);

  if (networkError) {
    return <NetworkError />;
  }

  if (!clientes) {
    return <CustomSpinner />;
  }

  return (
    <Fragment>
      <Row>
        <Col span={14}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={addClienteHandler}
            span={10}
            push={14}
          >
            Agregar Cliente
          </Button>
        </Col>
        <Col span={10}>
          <Input.Search
            span={14}
            pull={10}
            placeholder="Buscar..."
            enterButton
            onChange={(e) => search(e.target.value, clientes, setFilteredData)}
          />
        </Col>
      </Row>

      <Table size="small" columns={columns} dataSource={filteredData || clientes} />
    </Fragment>
  );
}
