import axios_instance from "../../services/httpClient/axios_instance";

export default class ClienteRepository {
  getClienteById(clienteId) {
    return new Promise((resolve, reject) => {
      axios_instance
        .get("/cliente/" + clienteId)
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
        .get("/cliente/?EmpresaId=" + empresaId)
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
        .post("/cliente", cliente)
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
        .put("/cliente", cliente)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
