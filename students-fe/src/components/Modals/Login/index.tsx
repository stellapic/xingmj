import React from "react";
import { Button, Input, Form, Checkbox, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { apiUserLogin, UserLoginData } from "../../../request/api";
import { modalTypes } from "../index";

interface LoginProps {
  typeChange: (type: modalTypes) => void;
  onCancel: () => void;
}
const Login: React.FC<LoginProps> = (props) => {
  const [form] = Form.useForm();
  const initialValues: UserLoginData & { remember: boolean } = {
    remember: localStorage.getItem("remember") === "true" ? true : false,
    username: localStorage.getItem("username") as string,
    password: localStorage.getItem("password") as string,
  };
  // 表单提交时触发的函数
  const onFinish = function (values: UserLoginData & { remember: boolean }) {
    const { username, password, remember } = values;
    // 判断是否记住登录状态等
    if (remember) {
      localStorage.setItem("remember", remember + "");
      localStorage.setItem("username", username);
      localStorage.setItem("password", password);
    } else {
      localStorage.removeItem("remember");
      localStorage.removeItem("username");
      localStorage.removeItem("password");
    }
    // 调用登录API
    apiUserLogin({
      username: username,
      password: password,
    }).then((data: any) => {
      form.resetFields();
      // 成功登录的时候显示登录成功，并关闭弹窗
      if (data.code === 200) {
        message.success("登录成功");
        localStorage.setItem("userToken", data.data["era_tkn"]);
        props.onCancel();
      } else {
        // 失败的时候显示错误信息
        message.error("用户名或密码错误");
      }
    });
  };
  return (
    <Form
      name="normal_login"
      className="login-form"
      initialValues={initialValues}
      form={form}
      onFinish={onFinish}>
      <Form.Item name="username" rules={[{ required: true, message: "请输入用户名！" }]}>
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          autoComplete="off"
          placeholder="输入用户名"
        />
      </Form.Item>
      <Form.Item name="password" rules={[{ required: true, message: "请输入密码！" }]}>
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="输入密码"
        />
      </Form.Item>
      <Form.Item style={{ textAlign: "left" }}>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>记住我</Checkbox>
        </Form.Item>

        <a href="/" style={{ float: "right" }}>
          忘记密码
        </a>
      </Form.Item>

      <Form.Item style={{ textAlign: "left" }}>
        <Button
          type="primary"
          block={true}
          htmlType="submit"
          size="large"
          className="login-form-button"
          style={{ marginBottom: "10px" }}>
          登录
        </Button>
        没有账号？
        <Button
          type="link"
          onClick={(e) => {
            e.preventDefault();
            props.typeChange("Register");
          }}>
          立即注册
        </Button>
      </Form.Item>
    </Form>
  );
};
export default Login;
