import axios_instance from "../../services/httpClient/axios_instance";

export default class ClienteRepository {
  getClienteById(clienteId) {
    return new Promise((resolve, reject) => {
      axios_instance
        .get(`/clientes/${clienteId}`)
        .then((response) => {
          const cliente = response.data;
          resolve(cliente);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  getClientes(empresaId) {
    return new Promise((resolve, reject) => {
      axios_instance
        .get(`empresas/${empresaId}/clientes`)
        .then((response) => {
          const clientes = response.data;
          const clientesWithKeys = clientes.map((e) => {
            return {
              ...e,
              key: e.id,
            };
          });
          resolve(clientesWithKeys);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  createCliente(cliente) {
    return new Promise((resolve, reject) => {
      axios_instance
        .post("/clientes", cliente)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  updateCliente(cliente) {
    return new Promise((resolve, reject) => {
      axios_instance
        .put("/clientes", cliente)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  searchClientes(empresaId, searchTerm) {
    return new Promise((resolve, reject) => {
      axios_instance
        .post(`empresas/${empresaId}/clientes/search`,{searchTerm})
        .then((response) => {
          const clientes = response.data;        
          resolve(clientes);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
