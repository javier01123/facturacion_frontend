import axios from "axios";
import { config } from "../../consts.js";
import { formatCreateAndUpdateErrors } from "../../utilities/repositoryUtils";

const instance = axios.create({
  baseURL: config.API_URL,
  withCredentials: true,
});

instance.CancelToken= axios.CancelToken;
instance.isCancel = axios.isCancel;

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

    if (response_error.response && response_error.response.status === 401)
      window.location.href = "/login";

    const formattedError = formatCreateAndUpdateErrors(response_error);

    return Promise.reject(formattedError);
  }
);

export default instance;
