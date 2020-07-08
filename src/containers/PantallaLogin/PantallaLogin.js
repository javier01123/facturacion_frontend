import React, { useState } from "react";
import axios_instance from "./../../services/httpClient/axios_instance";
import { Form, Input, Button, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import * as actions from "../../store/actionCreators";
import "./PantallaLogin.css";

const PantallaLogin = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
 

  const onFinish = (values) => {
    setIsSubmitting(true);
    axios_instance
      .post("/usuarios/authenticate", {
        Email: values.email,
        Password: values.password,
      })
      .then((response) => {
         dispatch(actions.loginInit());
        // history.push("/");
      })
      .catch((err) => {
        console.log({ err });
        // console.log(err.response.data.message);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="flex-container">
      <div className="flex-item">
        <Form
          className="login-form"
          name="normal_login"
          initialValues={{
            remember: true,
            email: "admin@noserver.com",
            password: "mypass",
          }}
          onFinish={onFinish}
        >
          <Form.Item>
            <div className="center-text">
              <h1>Log in</h1>
            </div>
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "email obligatorio!",
              },
              {
                type: "email",
                message: "formato de correo inválido",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "password obligatorio!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Contrasena"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary full-width"
              htmlType="submit"
              className="login-form-button"
              disabled={isSubmitting}
            >
              Login
            </Button>
          </Form.Item>

          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Recuerdame</Checkbox>
            </Form.Item>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default PantallaLogin;
