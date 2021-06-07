import React from "react";
import { Modal, Typography } from "antd";
import { WechatOutlined, QqOutlined } from "@ant-design/icons";
import Login from "./Login";
import Register from "./Register";
import basicStyle from "./style.less";
export type modalTypes = "Login" | "Register" | "UserInfo";

interface modalProps {
  visible: boolean;
  type: modalTypes;
  onCancel: (e: React.MouseEvent<HTMLElement>) => void;
  typeChange: (type: modalTypes) => void;
}

const titleMap = {
  Login: "登录",
  Register: "注册",
  UserInfo: "修改个人资料",
};

const { Title } = Typography;
const _Modal: React.FC<modalProps> = (props) => {
  const modalItems: any = {
    Login,
    Register,
  };
  const ExactItem: React.FC<any> = modalItems[props.type];
  return (
    <Modal
      wrapClassName={basicStyle.modalContainer}
      visible={props.visible}
      onCancel={props.onCancel}
      footer={null}
      centered={true}
      destroyOnClose={true}
      maskStyle={{ backdropFilter: "saturate(180%) blur(5px)" }}>
      <div className={basicStyle.modalContainer}>
        <Title level={3} style={{ marginBottom: "20px", textAlign: "center" }}>
          {titleMap[props.type]}
        </Title>
        <ExactItem onCancel={props.onCancel} typeChange={props.typeChange}></ExactItem>
        <footer style={{ textAlign: "right" }}>
          <a href="/">
            <span style={{ verticalAlign: "middle", marginRight: "3px" }}>QQ登录</span>
            <QqOutlined />
          </a>
          &ensp;
          <a href="/">
            <span style={{ verticalAlign: "middle", marginRight: "3px" }}>微信登录</span>
            <WechatOutlined />
          </a>
        </footer>
      </div>
    </Modal>
  );
};
export default _Modal;
