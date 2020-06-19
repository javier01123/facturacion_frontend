import axios_instance from "../../services/httpClient/axios_instance";
import * as actions from "../actionCreators";
import { put } from "redux-saga/effects";

export function* reloadEmpresasSaga(action) {
  const response = yield axios_instance.get("/empresa");
  yield put(actions.empresasReloaded(response.data));
}
