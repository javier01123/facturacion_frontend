import React from "react";
// import { css } from "@emotion/core";
import ClipLoader from "react-spinners/ClipLoader";
import "./CustomSpinner.css";

// Can be a string as well. Need to ensure each key-value pair ends with ;
// const override = css`
//   display: block;
//   margin: 0 auto;
//   border-color: red;
// `;

export default function CustomSpinner() {
  return (
    <div className="box">
      <div className="item">
        <ClipLoader
          size={100}
          // css={css}
          color={"#000000"}
        />
      </div>
    </div>
  );
}
