import React from "react";
import { Button, Input, Form, Checkbox, Typography } from "antd";
import basicStyle from "../../basic.less";
import {
  UserOutlined,
  LockOutlined,
  WechatOutlined,
  QqOutlined,
  CloseOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

interface LoginProps {
  isActive: boolean;
}
const Login: React.FC<LoginProps> = (props) => {
  // 表单提交时触发的函数
  const onFinish = function (values: any) {
    console.log(values);
  };
  // 关闭遮罩函数
  const closeLogin = function () {
    console.log("close login");
  };
  return (
    <div
      className={
        props.isActive ? `${basicStyle.modalActive} ${basicStyle.modal}` : basicStyle.modal
      }
      // 点击外部关闭遮罩
      onClick={closeLogin}>
      <div
        className={basicStyle.modalContainer}
        onClick={(e) => {
          // 阻止事件穿透，当点击除了登录框之外的位置才关闭遮罩层
          e.stopPropagation();
        }}>
        <div className={basicStyle.closeModal}>
          <CloseOutlined />
        </div>
        <Title level={3} style={{ marginBottom: "20px", textAlign: "center" }}>
          登录
        </Title>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}>
          <Form.Item name="username" rules={[{ required: true, message: "请输入用户名！" }]}>
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
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

            <a href="" style={{ float: "right" }}>
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
            没有账号？<a href="">立即注册</a>
          </Form.Item>
        </Form>
        {/* 其他方式登录 */}
        <div style={{ textAlign: "right" }}>
          <a href="">
            <span style={{ verticalAlign: "middle", marginRight: "3px" }}>QQ登录</span>
            <QqOutlined />
          </a>
          &ensp;
          <a href="">
            <span style={{ verticalAlign: "middle", marginRight: "3px" }}>微信登录</span>
            <WechatOutlined />
          </a>
        </div>
      </div>
    </div>
  );
};
export default Login;
