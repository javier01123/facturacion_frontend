import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:51346/api/",
  withCredentials: true,
});

instance.interceptors.request.use(
  (request) => {
    console.log({ request });
    return request;
  },
  (request_error) => {
    console.log({ request_error });
    return Promise.reject(request_error);
  }
);

instance.interceptors.response.use(
  (response) => {
    console.log({ response });
    return response;
  },
  (response_error) => {
    console.log({ response_error });

    if (response_error.response && response_error.response.status == 401)
      window.location.href = "/login";

    return Promise.reject(response_error);
  }
);

export default instance;
