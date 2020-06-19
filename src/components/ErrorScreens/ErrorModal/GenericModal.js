import React, { useState } from "react";
import Modal from "@material-ui/core/Modal";
// import { makeStyles } from "@material-ui/core/styles";

// const useStyles = makeStyles((theme) => ({}));

export default function ErrorModal(props) {
//   const classes = useStyles();
  const [open, setOpenState] = useState(false);
  const handleClose = () => {};

//   const message = props.message;
  
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <div>
        <h2 id="server-modal-title">Server-side modal</h2>
        <p id="server-modal-description">
          If you disable JavaScript, you will still see me.
        </p>
      </div>
    </Modal>
  );
}
