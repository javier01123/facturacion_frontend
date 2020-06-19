import React, { useState, useEffect, Fragment } from "react";
import axios_instance from "../../services/httpClient/axios_instance";
import { useHistory, Link } from "react-router-dom";
import CustomSpinner from "../../components/CustomSpinner/CustomSpinner";
import NetworkError from "../../components/ErrorScreens/NetworkError/NetworkError";
import { Table, Button, Space, Input, Row, Col } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";

function createColumn(dataIndex, title) {
  return {
    key: dataIndex,
    dataIndex,
    title,
    defaultSortOrder: "ascend",
    sortDirections: ["descend", "ascend"],
    sorter: (a, b) => a[dataIndex].localeCompare(b[dataIndex]),
  };
}

const columns = [
  createColumn("razonSocial", "Razón social"),
  createColumn("rfc", "RFC"),
];

const actionsColumn = {
  title: "Acción",
  key: "action",
  render: (text, record) => {
    return (
      <Space size="small">
        <Link to={`/clientes/edit/${record.id}`}>Editar</Link>
      </Space>
    );
  },
};

columns.push(actionsColumn);

export default function CatalogoClientes() {
  const [clientes, setClientes] = useState(null);
  const [networkError, setNetworkError] = useState(null);
  const [filteredData, setFilteredData] = useState(null);

  const empresaActualId = useSelector((state) => state.empresaActualId);
  let history = useHistory();
  let serachDelay;

  const getClientes = () => {
    axios_instance
      .get("/cliente/?EmpresaId=" + empresaActualId)
      .then((response) => {
        const data = response.data;
        const dataWithKeys = data.map((e) => {
          return {
            ...e,
            key: e.id,
          };
        });
        setClientes(dataWithKeys);
      })
      .catch((error) => {
        setNetworkError(error);
      });
  };

  const addClienteHandler = () => {
    history.push("/clientes/create");
  };

  const search = (value) => {
    if (serachDelay) {
      clearTimeout(serachDelay);
      serachDelay = null;
    }

    const executeSearch = () => {
      const data = clientes.filter((e) =>
        Object.keys(e).some((k) =>
          String(e[k]).toLowerCase().includes(value.toLowerCase())
        )
      );

      setFilteredData(data);
    };

    serachDelay = setTimeout(executeSearch, 300);
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
            onSearch={search}
            onChange={(e) => search(e.target.value)}
          />
        </Col>
      </Row>

      <Table columns={columns} dataSource={filteredData || clientes} />
    </Fragment>
  );
}
