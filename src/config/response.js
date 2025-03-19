const success = (message, results, statusCode) => {
  return {
    message,
    error: false,
    code: statusCode,
    results,
  };
};

const error = (message, errorData, statusCode) => {
  const codes = [200, 201, 400, 401, 404, 403, 409, 422, 500];

  const findCode = codes.find((code) => code == statusCode);

  if (!findCode) statusCode = 500;
  else statusCode = findCode;

  let formattedError = errorData;

  if (typeof errorData?.error === "string" && errorData.error.startsWith("[")) {
    try {
      const parsedErrors = JSON.parse(errorData.error);
      formattedError = parsedErrors.map((err) => ({
        field: err.path[0],
        message: err.message,
      }));
    } catch (e) {
      console.error("Error parsing validation errors:", e);
    }
  }

  return {
    message,
    code: statusCode,
    error: true,
    results: formattedError,
  };
};

export { error, success };
