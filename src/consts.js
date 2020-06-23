// Constants.jsconst prod = {
const production = {
  API_URL: "https://facturacion-backend-dev.herokuapp.com/api/",
};

const dev = {
  API_URL: "http://localhost:5000/api/",
};
export const config = process.env.NODE_ENV === "development" ? dev : production;
