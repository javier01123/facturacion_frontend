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
        .get(`/empresas/${empresaId}/cfdi`)
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

  agregarPartida(cfdiId, partida) {
    return new Promise((resolve, reject) => {
      axios_instance
        .post(`/cfdi/${cfdiId}/partidas`, partida)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  updatePartida(cfdiId, partida) {
    return new Promise((resolve, reject) => {
      axios_instance
        .put(`/cfdi/${cfdiId}/partidas`, partida)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
