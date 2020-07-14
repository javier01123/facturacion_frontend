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
    const values = form.getFieldsValue();

    if (values.cantidad && values.valorUnitario) {
      let importe = values.cantidad * values.valorUnitario;
      importe = Math.round(importe * 100) / 100;
      form.setFieldsValue({ importe });
    }
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
      <Form.Item name="id" style={{ display: "none" }}>
        <Input type="hidden" />
      </Form.Item>

      <div className="row">
        <div className="column">
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
        </div>
      </div>

      <div className="row">
        <div className="column">
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
        </div>
        <div className="column">
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
        </div>
        <div className="column">
          <Form.Item label="Importe" name="importe">
            <InputNumber readOnly disabled />
          </Form.Item>
        </div>
      </div>
    </Form>
  );
};

export default PartidaEdit;
