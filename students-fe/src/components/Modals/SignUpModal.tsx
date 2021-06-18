import React from "react";
import { connect } from "react-redux";
import { stateType } from "../../redux/store";
import { createSetTokenAction } from "../../redux/actions";
import { Button, Input, Form, Checkbox, message } from "antd";
import { UserOutlined, LockOutlined, MailOutlined, CheckSquareOutlined } from "@ant-design/icons";
import { apiUserSignUp } from "../../request/api";

// 注册组件props接口定义
interface SignUpProps {
  typeChange: (type: "Login" | "Register" | "UserInfo") => void;
  setToken: (userToken: string) => void;
  onCancel: () => void;
}

// 服务条款

// 注册组件
const SignUp: React.FC<SignUpProps> = (props) => {
  const [form] = Form.useForm();
  // 表单提交时触发的函数
  const onFinish = (values: any) => {
    console.log(values);
    // 检查是否同意服务条款
    if (!values.agree) {
      message.error("请同意服务条款");
    } else {
      apiUserSignUp(values).then((data) => {
        props.typeChange("Login");
        console.log(data);
      });
    }
  };
  // 校验两次输入的密码是否一致
  const checkPassword = (rule: any, value: string) => {
    let nowPassword = form.getFieldValue("password");
    console.log(nowPassword, value);
    try {
      if (nowPassword !== value) {
        throw new Error("密码不一致！");
      } else {
        return Promise.resolve("密码一致");
      }
    } catch (err) {
      return Promise.reject("密码不一致");
    }
  };
  return (
    <Form
      name="normal_login"
      form={form}
      className="login-form"
      initialValues={{ remember: true }}
      onFinish={onFinish}>
      <Form.Item name="username" rules={[{ required: true, message: "请输入用户名！" }]}>
        <Input autoComplete="off" prefix={<UserOutlined />} placeholder="输入用户名" />
      </Form.Item>
      <Form.Item name="password" rules={[{ required: true, message: "请输入密码！" }]}>
        <Input prefix={<LockOutlined />} type="password" placeholder="输入密码" />
      </Form.Item>
      <Form.Item
        name="confirmPassword"
        rules={[
          {
            required: true,
            message: "密码不一致！",
            validateTrigger: "onBlur",
            validator: checkPassword,
          },
        ]}
        validateTrigger={["onChange", "onBlur"]}>
        <Input prefix={<CheckSquareOutlined />} type="password" placeholder="确认密码" />
      </Form.Item>
      <Form.Item
        name="email"
        rules={[
          {
            required: true,
            type: "email",
            message: "请输入正确的邮箱！",
            whitespace: true,
            validateTrigger: "onBlur",
          },
        ]}
        validateTrigger={["onBlur", "onChange"]}>
        <Input autoComplete="off" prefix={<MailOutlined />} type="email" placeholder="Email" />
      </Form.Item>

      <Form.Item style={{ textAlign: "left" }}>
        <Button
          type="primary"
          block={true}
          htmlType="submit"
          size="large"
          className="login-form-button"
          style={{ marginBottom: "10px" }}>
          注册
        </Button>
        <Form.Item name="agree" valuePropName="checked" noStyle>
          <Checkbox>
            同意<a href="/">服务条款</a>
          </Checkbox>
        </Form.Item>

        <span style={{ float: "right" }}>
          已有账号？
          <Button
            type="link"
            onClick={(e) => {
              e.preventDefault();
              props.typeChange("Login");
            }}>
            立即登录
          </Button>
        </span>
      </Form.Item>
    </Form>
  );
};
export default connect((state: stateType) => ({ userToken: state.userToken }), {
  setToken: createSetTokenAction,
})(SignUp);
