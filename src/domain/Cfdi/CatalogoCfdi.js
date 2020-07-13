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
  createColumn("razonSocialCliente", "Razón social"),
  createColumn("rfcCliente", "RFC"),
  createColumn("fechaEmision", "Fecha de Emisión"),
  createColumn("total", "Total", { isNumeric: true }),
  createEditarColumn("Editar", "editar", "/cfdi/edit/"),
];

export default function CatalogoCfdi() {
  const [cfdis, setCfdis] = useState(null);
  const [networkError, setNetworkError] = useState(null);
  const [filteredData, setFilteredData] = useState(null);

  // const empresaActualId = useSelector((state) => state.empresaActualId);
  const sucursalActualId = useSelector((state) => state.sucursalActualId);
  let history = useHistory();
  const cfdiRepository = new CfdiRepository();

  const getCfdis = () => {
    cfdiRepository
      .getCfdiPorSucursal(sucursalActualId)
      .then((response) => {
        setCfdis(response);
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
