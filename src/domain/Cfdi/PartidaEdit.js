import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ClienteRepository from "../Cliente/ClienteRepository";
import EmpresaRepository from "../Empresa/EmpresaRepository";
import CfdiRepository from "./CfdiRepository";
import CustomSpinner from "../../components/CustomSpinner/CustomSpinner";
import NetworkError from "../../components/ErrorScreens/NetworkError/NetworkError";
import ValidationErrors from "../../components/ErrorScreens/ValidationErrors/ValidationErrors";
import { SaveOutlined } from "@ant-design/icons";
import { useToasts } from "react-toast-notifications";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "react-redux";
import moment from "moment";
import { createColumn } from "../../utilities/tableUtils";
import {
  Form,
  AutoComplete,
  DatePicker,
  Input,
  InputNumber,
  Table,
  Button,
  Card,
  Divider,
  message,
  Modal,
  Space,
} from "antd";

const PartidaEdit = (props) => {
  let { id } = useParams();
  const { addToast } = useToasts();
  const cfdiId = id;
  const cfdiRepository = new CfdiRepository();
  const [isLoading, setIsLoading] = useState();
  const [isPartidaNueva, setIsPartidaNueva] = useState();

  const [form] = Form.useForm();

  React.useEffect(() => {
    // console.log({ msg: "component updated", props });
    form.setFieldsValue(props);
  });

  

  const valuesChangedHandler = (formValues) => {
   console.log({formValues});

    // formValues.importe = formValues.cantidad * formValues.valorUnitario;
    // form.setFieldsValue(formValues);

  };

  return (
    <Form
      form={form}
      id="partidaform"
      name="basic"
      size="small"
      onFinish={props.submitHandler}
      onValuesChange={valuesChangedHandler}
      initialValues={props}
    >
      <Form.Item name="id">
        <Input type="hidden" />
      </Form.Item>

      <Form.Item
        label="Descripción"
        name="descripcion"
        rules={[
          {
            required: true,
            whitespace: true,
            message: "obligatorio",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Cantidad"
        name="cantidad"
        min={0}
        step={1}
        rules={[
          {
            required: true,
            message: "obligatorio",
          },
        ]}
      >
        <InputNumber />
      </Form.Item>
      <Form.Item
        label="Valor Unitario"
        name="valorUnitario"
        min={0}
        rules={[
          {
            required: true,
            message: "obligatorio",
          },
        ]}
      >
        <InputNumber />
      </Form.Item>
      <Form.Item label="Importe" name="importe">
        <InputNumber readOnly disabled />
      </Form.Item>
    </Form>
  );
};

export default PartidaEdit;
