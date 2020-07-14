import React, { useState, useEffect, Fragment } from "react";
import CfdiRepository from "./CfdiRepository";
import { useHistory } from "react-router-dom";
import CustomSpinner from "../../components/CustomSpinner/CustomSpinner";
import NetworkError from "../../components/ErrorScreens/NetworkError/NetworkError";
import { Table, Button, Input, Row, Col } from "antd";
import { PlusOutlined, EditTwoTone, DeleteTwoTone } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import * as tableUtils from "../../utilities/tableUtils";
import * as renderers from "../../utilities/columnRederers";

// const actionsColum = {
//   title: "",
//   key: "acciones",
//   width: 100,
//   render: (text, record) => {
//     return (
//       <React.Fragment>
//         <Link size="small" to={`/cfdi/edit/${record.id}`}>
//           <EditTwoTone />
//         </Link>
//       </React.Fragment>
//     );
//   },
// };

const columns = [
  tableUtils.createColumn("serie", "Serie"),
  tableUtils.createColumn("folio", "Folio", { isNumeric: true }),
  tableUtils.createColumn("fechaEmision", "Fecha de Emisión", {
    responsive: ["md"],
    render: renderers.dateRenderer,
  }),
  tableUtils.createColumn("razonSocialCliente", "Razón Social", {
    responsive: ["md"],
  }),
  tableUtils.createColumn("rfcCliente", "RFC", { responsive: ["md"] }),
  tableUtils.createColumn("total", "Total", {
    isNumeric: true,
    render: renderers.moneyRenderer,
  }),
  tableUtils.createActionsColumn("", "editar", "/cfdi/edit/"),
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
            onChange={(e) =>
              tableUtils.search(e.target.value, cfdis, setFilteredData)
            }
          />
        </Col>
      </Row>

      <Table
        size="small"
        showSorterTooltip={false}
        columns={columns}
        dataSource={filteredData || cfdis}
      />
    </Fragment>
  );
}
