import React from "react";
import { Alert } from "antd";
// import "../../../containers/Home/node_modules/antd/dist/antd.css";

export default function ValidationErrors(props) {
  const errorObject = props.validationErrors;

  return (
    <div>
      <Alert
        message="Errores de validación"
       
        description={  (
          <ul>
          {Object.keys(errorObject).map((property) => {
            return errorObject[property].map((mensaje) => {
              return <li key={mensaje}>{mensaje}</li>;
            });
          })}
        </ul>
        )}
        type="error"
        showIcon
      > </Alert>
        
     
    </div>
  );
}
