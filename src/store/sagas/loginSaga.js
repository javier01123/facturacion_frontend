import axios_instance from "../../services/httpClient/axios_instance";
import * as actionCreators from "../actionCreators";
import { put } from "redux-saga/effects";


export function* loginSaga(action) {
  try {
    const response = yield axios_instance.get("/empresa");
    const empresas = response.data;
    const empresaId = empresas[0].id;

    const sucursalesResponse = yield axios_instance.get(
      "/sucursal/?EmpresaId=" + empresaId
    );
    const sucursales = sucursalesResponse.data;
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
