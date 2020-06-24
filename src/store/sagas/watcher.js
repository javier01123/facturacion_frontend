import { takeEvery } from "redux-saga/effects";
import {loginSaga} from "./loginSaga";
import {empresaChangedSaga} from "./empresaChangedSaga";
import * as actionTypes from "../actionTypes";

export function* watchEmpresasReload() {
  yield takeEvery(actionTypes.LOGIN_INIT, loginSaga);
}

export function* watchEmpresaChanged() {
 
  yield takeEvery(actionTypes.EMPRESA_CHANGED_INIT, empresaChangedSaga );
}
