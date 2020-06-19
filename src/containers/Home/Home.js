import React, { useState, useEffect } from "react";
import { Layout, Menu, Breadcrumb, Select } from "antd";
import { Route, Switch } from "react-router";
import { Link } from "react-router-dom";
import ErrorBoundary from "../../components/ErrorHandlers/ErrorBoundary/ErrorBoundary";
import CatalogoEmpresas from "../../domain/Empresa/CatalogoEmpresas";
import CreateEmpresa from "../../domain/Empresa/CreateEmpresa";
import EditEmpresa from "../../domain/Empresa/EditEmpresa";

import CatalogoSucursales from "../../domain/Sucursal/CatalogoSucursales";
import CreateSucursal from "../../domain/Sucursal/CreateSucursal";
import EditSucursal from "../../domain/Sucursal/EditSucursal";

import CatalogoClientes from "../../domain/Cliente/CatalogoClientes";
import CreateCliente from "../../domain/Cliente/CreateCliente";
import EditCliente from "../../domain/Cliente/EditCliente";

import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../store/actionCreators";
// import { NodeExpandOutlined } from "@ant-design/icons";

const { Option } = Select;
const { Header, Content, Footer } = Layout;

const Home = () => {
  const dispatch = useDispatch();

  const handleEmpresaChanged = (value) => {
    dispatch(actions.empresaSelectedChanged(value));
  };

  const handleSucursalChanged = (value) => {
    dispatch(actions.sucursalSelectedChanged(value));
  };

  const empresas = useSelector((store) => store.empresas);
  const sucursales = useSelector((store) => store.sucursales);
  const empresaActualId = useSelector((store) => store.empresaActualId);
  const sucursalActualId = useSelector((store) => store.sucursalActualId);

  return (
    <Layout
      className="layout"
      style={{ padding: 0, margin: 0, flex: "none !important" }}
    >
      <Header>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}>
          <Menu.Item key="1">
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/empresas">Empresas</Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link to="/sucursales">Sucursales</Link>
          </Menu.Item>
          <Menu.Item key="4">
            <Link to="/clientes">Clientes</Link>
          </Menu.Item>
          <Menu.Item key="5">
            <Link to="/emitir_cfdi">Emitir CFDI</Link>
          </Menu.Item>
          <Menu.Item key="6" disabled>
            {empresas && (
              <Select
                style={{ width: 250 }}
                onChange={handleEmpresaChanged}
                value={empresaActualId}
              >
                {empresas.map((item) => {
                  return (
                    <Option key={item.id} value={item.id}>
                      {item.razonSocial}
                    </Option>
                  );
                })}
              </Select>
            )}
          </Menu.Item>
          <Menu.Item key="7" disabled>
            {sucursales && (
              <Select
                style={{ width: 250 }}
                onChange={handleSucursalChanged}
                value={sucursalActualId}
              >
                {sucursales.map((item) => {
                  return (
                    <Option key={item.id} value={item.id}>
                      {item.nombre}
                    </Option>
                  );
                })}
              </Select>
            )}
          </Menu.Item>

          <Menu.Item key="8" style={{ float: "right" }}>
            <div
              onClick={() => {
                window.location.href = "/login";
              }}
            >
              Logout
            </div>
          </Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: "0 50px" }}>
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb>
        <div className="site-layout-content">
          <ErrorBoundary>
            <Switch>
              <Route exact path="/empresas" component={CatalogoEmpresas} />
              <Route path="/empresas/edit/:id" component={EditEmpresa} />
              <Route path="/empresas/create" component={CreateEmpresa} />
              <Route exact path="/sucursales" component={CatalogoSucursales} />
              <Route path="/sucursales/edit/:id" component={EditSucursal} />
              <Route path="/sucursales/create" component={CreateSucursal} />
              <Route exact path="/clientes" component={CatalogoClientes} />
              <Route path="/clientes/edit/:id" component={EditCliente} />
              <Route path="/clientes/create" component={CreateCliente} />

              <Route exact path="/">
                <div>Home</div>
              </Route>

              <Route path="/">
                <div>404 - Página no encontrada</div>
              </Route>
            </Switch>
          </ErrorBoundary>
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}></Footer>
    </Layout>
  );
};

export default Home;
