import React, { useState, useEffect, Fragment } from "react";
import CfdiRepository from "./CfdiRepository";
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
  createColumn("total", "Total"),
  createEditarColumn("Editar", "editar", "/clientes/edit/"),
];

export default function CatalogoCfdi() {
  const [cfdis, setCfdis] = useState(null);
  const [networkError, setNetworkError] = useState(null);
  const [filteredData, setFilteredData] = useState(null);

  const empresaActualId = useSelector((state) => state.empresaActualId);
  let history = useHistory();
  const CfdiRepository = new CfdiRepository();

  const getCfdis = () => {
    CfdiRepository.getCfdis(empresaActualId)
      .then((cfdis) => {
        setCfdis(cfdis);
      })
      .catch((error) => {
        setNetworkError(error);
      });
  };

  const addCfdiHandler = () => {
    history.push("/cfdi/create");
  };

  useEffect(getCfdis, []);

  if (networkError) {
    return <NetworkError />;
  }

  if (!cfdis) {
    return <CustomSpinner />;
  }

  return (
    <Fragment>
      <Row>
        <Col span={14}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={addCfdiHandler}
            span={10}
            push={14}
          >
            Agregar Cfdi
          </Button>
        </Col>
        <Col span={10}>
          <Input.Search
            span={14}
            pull={10}
            placeholder="Buscar..."
            enterButton
            onChange={(e) => search(e.target.value, cfdis, setFilteredData)}
          />
        </Col>
      </Row>

      <Table columns={columns} dataSource={filteredData || cfdis} />
    </Fragment>
  );
}
