import * as actionCreators from "../actionCreators";
import { put } from "redux-saga/effects";
import SucursalRepository from "../../domain/Sucursal/SucursalRepository";

export function* empresaChangedSaga(action) {
  const empresaId = action.payload.empresaId;
  const sucursalRepository = new SucursalRepository();
  const sucursales = yield sucursalRepository.getSucursales(empresaId)
  const sucursalId = sucursales[0].id;

  yield put(
    actionCreators.empresaSelectedChangedFinished({
      sucursales: sucursales,
      empresaActualId: empresaId,
      sucursalActualId: sucursalId,
    })
  );
}
