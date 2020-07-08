import axios_instance from "../../services/httpClient/axios_instance";


export default class SucursalRepository {
  getSucursalById(sucursalId) {
    return new Promise((resolve, reject) => {
      axios_instance
        .get(`/sucursales/${sucursalId}`)
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
        .get(`empresas/${empresaId}/sucursales`)
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
        .post("/sucursales", sucursal)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  updateSucursal(sucursal) {
    return new Promise((resolve, reject) => {
      axios_instance
        .put("/sucursales", sucursal)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
