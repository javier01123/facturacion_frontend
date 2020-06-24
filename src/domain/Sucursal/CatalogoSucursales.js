import React, { useState, useEffect, Fragment } from "react";
import axios_instance from "../../services/httpClient/axios_instance";
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
  createColumn("nombre", "Nombre"),
  createEditarColumn("Editar", "editar", "/sucursales/edit/"),
];

export default function CatalogoSucursales() {
  const [sucursales, setSucursales] = useState(null);
  const [networkError, setNetworkError] = useState(null);
  const [filteredData, setFilteredData] = useState(null);

  let history = useHistory();
  const empresaActualId = useSelector((state) => state.empresaActualId);

  const getSucursales = () => {
    axios_instance
      .get("/sucursal/?EmpresaId=" + empresaActualId)
      .then((response) => {
        const data = response.data;
        const dataWithKeys = data.map((e) => {
          return {
            ...e,
            key: e.id,
          };
        });
        setSucursales(dataWithKeys);
      })
      .catch((error) => {
        setNetworkError(error);
      });
  };

  const addSucursalHandler = () => {
    history.push("/sucursales/create");
  };

  useEffect(getSucursales, []);

  if (networkError) {
    return <NetworkError />;
  }

  if (!sucursales) {
    return <CustomSpinner />;
  }

  return (
    <Fragment>
      <Row>
        <Col span={14}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={addSucursalHandler}
            span={10}
            push={14}
          >
            Agregar Sucursal
          </Button>
        </Col>
        <Col span={10}>
          <Input.Search
            span={14}
            pull={10}
            placeholder="Buscar..."
            enterButton           
            onChange={(e) =>
              search(e.target.value, sucursales, setFilteredData)
            }
          />
        </Col>
      </Row>

      <Table columns={columns} dataSource={filteredData || sucursales} />
    </Fragment>
  );
}
