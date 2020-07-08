import axios_instance from "../../services/httpClient/axios_instance";

export default class CfdiRepository {
  getCfdiById(cfdiId) {
    return new Promise((resolve, reject) => {
      axios_instance
        .get("/cfdi/" + cfdiId)
        .then((response) => {
          const cfdi = response.data;
          resolve(cfdi);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  getCfdis(empresaId) {
    return new Promise((resolve, reject) => {
      axios_instance
        .get("/cfdi/?EmpresaId=" + empresaId)
        .then((response) => {
          const cfdis = response.data;
          const cfdisWithKeys = cfdis.map((e) => {
            return {
              ...e,
              key: e.id,
            };
          });
          resolve(cfdisWithKeys);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  createCfdi(cfdi) {
    return new Promise((resolve, reject) => {
      axios_instance
        .post("/cfdi", cfdi)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  updateCfdi(cfdi) {
    return new Promise((resolve, reject) => {
      axios_instance
        .put("/cfdi", cfdi)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
