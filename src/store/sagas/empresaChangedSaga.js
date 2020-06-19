import axios_instance from "../../services/httpClient/axios_instance";
import * as actionCreators from "../actionCreators";
import { put } from "redux-saga/effects";

export function* empresaChangedSaga(action) {
    console.log('[empresa changed saga]');
  const empresaId = action.payload.empresaId;

  const sucursalesResponse = yield axios_instance.get(
    "/sucursal/?EmpresaId=" + empresaId
  );
  const sucursales = sucursalesResponse.data;
  const sucursalId = sucursales[0].id;

  yield put(
    actionCreators.empresaSelectedChangedFinished({       
      sucursales: sucursales,
      empresaActualId: empresaId,
      sucursalActualId: sucursalId,
    })
  );
}
