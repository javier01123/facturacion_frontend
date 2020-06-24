export const formatCreateAndUpdateErrors = (axiosError) => {
  let formatedError = {};
  const response = axiosError.response;

  if (response && response.status === 400) {
    formatedError.isValidationError = true;
    formatedError.validationErrors = response.data.errors;
  }

  return formatedError;
};
