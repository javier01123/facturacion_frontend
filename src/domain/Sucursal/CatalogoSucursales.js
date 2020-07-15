import React, { useState, useEffect, Fragment } from "react";
import { useHistory } from "react-router-dom";
import SucursalRepository from "./SucursalRepository";
import CustomSpinner from "../../components/CustomSpinner/CustomSpinner";
import NetworkError from "../../components/ErrorScreens/NetworkError/NetworkError";
import { Table, Button, Input, Row, Col } from "antd";
import { PlusCircleTwoTone } from "@ant-design/icons";
import { useSelector } from "react-redux";
import * as tableUtils from "../../utilities/tableUtils";

const columns = [
  tableUtils.createColumn("nombre", "Nombre"),
  tableUtils.createActionsColumn("", "editar", "/sucursales/edit/"),
];

export default function CatalogoSucursales() {
  const [sucursales, setSucursales] = useState(null);
  const [networkError, setNetworkError] = useState(null);
  const [filteredData, setFilteredData] = useState(null);

  let history = useHistory();
  const empresaActualId = useSelector((state) => state.empresaActualId);
  const sucursalRepository = new SucursalRepository();

  const getSucursales = () => {
    sucursalRepository
      .getSucursales(empresaActualId)
      .then((sucursales) => {
        setSucursales(sucursales);
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
      <Row style={{padding:'5px 0px'}}>
        <Col span={14}>
          <Button
            type="primary"
            icon={<PlusCircleTwoTone />}
            onClick={addSucursalHandler}
            span={10}
            push={14}
          >
            Agregar
          </Button>
        </Col>
        <Col span={10}>
          <Input.Search
            span={14}
            pull={10}
            placeholder="Buscar..."
            enterButton
            onChange={(e) =>
              tableUtils.search(e.target.value, sucursales, setFilteredData)
            }
          />
        </Col>
      </Row>

      <Table
        size="small"
        showSorterTooltip={false}
        columns={columns}
        dataSource={filteredData || sucursales}
      />
    </Fragment>
  );
}
