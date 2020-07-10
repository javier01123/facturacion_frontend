import React from "react";
import { Form, Input, InputNumber } from "antd";

const PartidaEdit = (props) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    form.setFieldsValue(props);
  });

  const valuesChangedHandler = (formValues) => {
    //  console.log({formValues});
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
