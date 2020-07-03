export const formatCreateAndUpdateErrors = (axiosError) => {
  let formatedError = {};
  const response = axiosError.response;

  if (!response){
     return {};
  }

  if (response && response.status === 400) {
    formatedError.isValidationError = true;
    formatedError.validationErrors = response.data;
  } else {
    formatedError.message = response.data.error;
  }

  return formatedError;
};
