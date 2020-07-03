import axios_instance from "../../services/httpClient/axios_instance";


export default class EmpresaRepository {
  getEmpresaById(empresaId) {
    return new Promise((resolve, reject) => {
      axios_instance
        .get(`/empresa/${empresaId}`)
        .then((response) => {
          const empresa = response.data;
          resolve(empresa);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

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
          reject(error);
        });
    });
  }

  isRfcDisponible(rfc){
    return new Promise((resolve,reject)=>{
      axios_instance
        .get(`/empresa/isRfcDisponible/${rfc}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

 
}
