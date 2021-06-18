import React from "react";
import { Modal, Typography } from "antd";
import { WechatOutlined, QqOutlined } from "@ant-design/icons";
import Login from "./LoginModal";
import SignUp from "./SignUpModal";
import basicStyle from "./style.less";
export type modalTypes = "Login" | "SignUp" | "UserInfo";

interface modalProps {
  visible: boolean;
  type: modalTypes;
  onCancel: (e: React.MouseEvent<HTMLElement>) => void;
  typeChange: (type: modalTypes) => void;
}

const titleMap = {
  Login: "登录",
  SignUp: "注册",
  UserInfo: "修改个人资料",
};

const { Title } = Typography;
const _Modal: React.FC<modalProps> = (props) => {
  const modalItems: any = {
    Login,
    SignUp,
  };
  const ExactItem: React.FC<any> = modalItems[props.type];
  return (
    <Modal
      wrapClassName={basicStyle.modalContainer}
      visible={props.visible}
      onCancel={props.onCancel}
      footer={null}
      centered={true}
      maskStyle={{ backdropFilter: "saturate(180%) blur(5px)" }}>
      <div className={basicStyle.modalContainer}>
        {/* 标题 */}
        <TilleComponent type={props.type}></TilleComponent>
        {/* 主要内容 */}
        <ExactItem onCancel={props.onCancel} typeChange={props.typeChange}></ExactItem>
        {/* 底部 */}
        <FooterComponent type={props.type}></FooterComponent>
      </div>
    </Modal>
  );
};

const TilleComponent: React.FC<{ type: modalTypes }> = (props) => {
  return (
    <Title level={3} style={{ marginBottom: "20px", textAlign: "center" }}>
      {titleMap[props.type]}
    </Title>
  );
};

const FooterComponent: React.FC<{ type: modalTypes }> = (props) => {
  if (props.type === "Login" || props.type === "SignUp") {
    return (
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
    );
  } else {
    return null;
  }
};

export default _Modal;
