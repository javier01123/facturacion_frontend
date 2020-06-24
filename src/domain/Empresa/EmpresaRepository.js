import axios_instance from "../../services/httpClient/axios_instance";

export default class EmpresaRepository {
  getEmpresas() {
    return new Promise((resolve, reject) => {
      axios_instance
        .get("/empresa")
        .then((response) => {
          const empresas = response.data;
          const empresasWithKeys = empresas.map((e) => {
            return {
              ...e,
              key: e.id,
            };
          });
          resolve(empresasWithKeys);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  createEmpresa(empresaToPost) {
    return new Promise((resolve, reject) => {
      axios_instance
        .post("/empresa", empresaToPost)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
            let formatedError = {};
            const response = error.response;
  
            if (response && response.status === 400) {
              formatedError.isValidationError = true;
              formatedError.validationErrors = response.data.errors;
            }
  
            reject(formatedError);
        });
    });
  }

  getEmpresaById(empresaId) {
    return new Promise((resolve, reject) => {
      axios_instance
        .get("/empresa/" + empresaId)
        .then((response) => {
          const empresa = response.data;
          resolve(empresa);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  updateEmpresa(empresa) {
    return new Promise((resolve, reject) => {
      axios_instance
        .put("/empresa", empresa)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          let formatedError = {};
          const response = error.response;

          if (response && response.status === 400) {
            formatedError.isValidationError = true;
            formatedError.validationErrors = response.data.errors;
          }

          reject(formatedError);
        });
    });
  }
}
