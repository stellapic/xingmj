import React from "react";
import { Button, Input, Form, Checkbox, Typography, Cascader, Row, Col } from "antd";
import { CascaderOptionType } from "antd/lib/cascader";
import basicStyle from "../../basic.less";
import {
  UserOutlined,
  LockOutlined,
  WechatOutlined,
  QqOutlined,
  CloseOutlined,
  MailOutlined,
} from "@ant-design/icons";

const { Title } = Typography;
// 注册组件props接口定义
interface RegisterProps {
  isActive: boolean;
}
const Register: React.FC<RegisterProps> = (props) => {
  // 表单提交时触发的函数
  const onFinish = function (values: any) {
    console.log(values);
  };
  // 关闭遮罩函数
  const closeRegister = function () {
    console.log("close login");
  };

  const sexOptions: CascaderOptionType[] = [
    {
      value: "0",
      label: "男",
    },
    {
      value: "1",
      label: "女",
    },
  ];
  const locationOptions: CascaderOptionType[] = [
    {
      value: "0",
      label: "广东",
    },
    {
      value: "1",
      label: "北京",
    },
    {
      value: "2",
      label: "上海",
    },
    {
      value: "3",
      label: "辽宁",
    },
    {
      value: "4",
      label: "吉林",
    },
    {
      value: "5",
      label: "黑龙江",
    },
  ];
  return (
    <div
      className={
        props.isActive ? `${basicStyle.modalActive} ${basicStyle.modal}` : basicStyle.modal
      }
      // 点击外部关闭遮罩
      onClick={closeRegister}>
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
          注册
        </Title>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}>
          <Form.Item name="username" rules={[{ required: true, message: "请输入用户名！" }]}>
            <Input prefix={<UserOutlined />} placeholder="输入用户名" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: "请输入密码！" }]}>
            <Input prefix={<LockOutlined />} type="password" placeholder="输入密码" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: "请确认密码！" }]}>
            <Input prefix={<LockOutlined />} type="password" placeholder="确认密码" />
          </Form.Item>
          <Form.Item name="email" rules={[{ required: true, message: "请输入您的邮箱！" }]}>
            <Input prefix={<MailOutlined />} type="email" placeholder="Email" />
          </Form.Item>

          <Row justify="space-between">
            <Col span={9}>
              <Form.Item name="sex" rules={[{ required: true, message: "请输入您的邮箱！" }]}>
                <Cascader options={sexOptions} placeholder="性别"></Cascader>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="location" rules={[{ required: true, message: "请输入您的邮箱！" }]}>
                <Cascader options={locationOptions} placeholder="居住地"></Cascader>
              </Form.Item>
            </Col>
          </Row>

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
            <Checkbox>
              同意<a href="">服务条款</a>
            </Checkbox>
            <span style={{ float: "right" }}>
              已有账号？<a href="">立即登录</a>
            </span>
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
export default Register;
