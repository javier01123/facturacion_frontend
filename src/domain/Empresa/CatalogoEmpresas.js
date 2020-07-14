import React, { useState, useEffect, Fragment } from "react";
import { useHistory } from "react-router-dom";
import CustomSpinner from "../../components/CustomSpinner/CustomSpinner";
import NetworkError from "../../components/ErrorScreens/NetworkError/NetworkError";
import { Table, Button, Input, Row, Col } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import EmpresaRepository from "./EmpresaRepository";
import {
  createColumn,
  createEditarColumn,
  search,
} from "../../utilities/tableUtils";

const columns = [
  createColumn("razonSocial", "Razón social", { responsive: ["md"] }),
  createColumn("nombreComercial", "Nombre comercial"),
  createColumn("rfc", "RFC"),
  createEditarColumn("", "editar", "/empresas/edit/"),
];

export default function CatalogoEmpresas() {
  const [empresas, setEmpresas] = useState(null);
  const [networkError, setNetworkError] = useState(null);
  const [filteredData, setFilteredData] = useState(null);

  let history = useHistory();
  const empresaRepository = new EmpresaRepository();

  const getEmpresas = () => {
    empresaRepository
      .getEmpresas()
      .then((data) => {
        setEmpresas(data);
      })
      .catch((error) => {
        setNetworkError(error);
      });
  };

  const addEmpresaHandler = () => {
    history.push("/empresas/create");
  };

  useEffect(getEmpresas, []);

  if (networkError) {
    return <NetworkError />;
  }

  if (!empresas) {
    return <CustomSpinner />;
  }

  return (
    <Fragment>
      <Row>
        <Col span={14}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={addEmpresaHandler}
            span={10}
            push={14}
          >
            Agregar Empresa
          </Button>
        </Col>
        <Col span={10}>
          <Input.Search
            span={14}
            pull={10}
            placeholder="Buscar..."
            enterButton
            // onSearch={(value) => {
            //   search(value, empresas, setFilteredData);
            // }}
            onChange={(e) => search(e.target.value, empresas, setFilteredData)}
          />
        </Col>
      </Row>

      <Table size="small" columns={columns} dataSource={filteredData || empresas} />
    </Fragment>
  );
}
