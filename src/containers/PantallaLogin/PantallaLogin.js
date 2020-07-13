import React, { useState } from "react";
import axios_instance from "./../../services/httpClient/axios_instance";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import * as actions from "../../store/actionCreators";
import { Form, Input, Button, Alert, Space } from "antd";
import "./PantallaLogin.css";

const PantallaLogin = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState();
  const dispatch = useDispatch();

  const onFinish = (values) => {
    setIsSubmitting(true);
    setLoginError(null);
    axios_instance
      .post("/usuarios/authenticate", {
        Email: values.email,
        Password: values.password,
      })
      .then((response) => {
        dispatch(actions.loginInit());
      })
      .catch((err) => {
        console.log({ err });
        if (err.message) {
          setLoginError(err.message);
        } else {
          setLoginError("no se recibió respuesta del servidor");
        }
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const emailRules = [
    { required: true, message: "email obligatorio" },
    { type: "email", message: "formato de correo inválido" },
  ];

  const passwordRules = [{ required: true, message: "contraseña obligatoria" }];

  return (
    <div className="flex-container">
      <div className="flex-item">
        <Form
          className="login-form"
          name="normal_login"
          initialValues={{ email: "admin@noserver.com", password: "mypass" }}
          onFinish={onFinish}
        >
          <Form.Item>
            <div className="center-text">
              <h1>Log in</h1>
            </div>
          </Form.Item>
          <Form.Item name="email" rules={emailRules}>
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Email"
            />
          </Form.Item>

          <Form.Item name="password" rules={passwordRules}>
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Contraseña"
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

          {loginError && (
            <Alert message="Error" description={loginError} type="error" />
          )}

          <Space />
        </Form>
      </div>
    </div>
  );
};

export default PantallaLogin;
