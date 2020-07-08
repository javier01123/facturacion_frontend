import * as actionCreators from "../actionCreators";
import { put } from "redux-saga/effects";
import EmpresaRepository from "./../../domain/Empresa/EmpresaRepository";
import SucursalRepository from "./../../domain/Sucursal/SucursalRepository";

export function* loginSaga(action) {
  try {
    const empresaRepository = new EmpresaRepository();
    const sucursalRepository = new SucursalRepository();

    const empresas = yield empresaRepository.getEmpresas();
    const empresaId = empresas[0].id;     
    const sucursales = yield  sucursalRepository.getSucursales(empresaId);
    const sucursalId = sucursales[0].id;
    //TODO: en el action enviar el usuarioId, o en el evento de LOGIN_INT?
    yield put(
      actionCreators.loggedIn({
        empresas: empresas,
        sucursales: sucursales,
        empresaActualId: empresaId,
        sucursalActualId: sucursalId,
      })
    );

   window.location.href = "/";

  } catch (ex) {
    console.log({ ex });
  }
}
