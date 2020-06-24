import axios_instance from "../../services/httpClient/axios_instance";
import { formatCreateAndUpdateErrors } from "../../utilities/repositoryUtils";

export default class SucursalRepository {
  getSucursalById(sucursalId) {
    return new Promise((resolve, reject) => {
      axios_instance
        .get("/sucursal/" + sucursalId)
        .then((response) => {
          const sucursal = response.data;
          resolve(sucursal);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  getSucursales(empresaId) {
    return new Promise((resolve, reject) => {
      axios_instance
        .get("/sucursal/?EmpresaId=" + empresaId)
        .then((response) => {
          const sucursales = response.data;
          const sucursalesWithKeys = sucursales.map((e) => {
            return {
              ...e,
              key: e.id,
            };
          });
          resolve(sucursalesWithKeys);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  createSucursal(sucursal) {
    return new Promise((resolve, reject) => {
      axios_instance
        .post("/sucursal", sucursal)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(formatCreateAndUpdateErrors(error));
        });
    });
  }

  updateSucursal(sucursal) {
    return new Promise((resolve, reject) => {
      axios_instance
        .put("/sucursal", sucursal)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(formatCreateAndUpdateErrors(error));
        });
    });
  }
}
