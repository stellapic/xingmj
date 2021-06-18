import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { stateType } from "../../redux/store";
import { Link } from "react-router-dom";
import { Row, Col, Dropdown } from "antd";
import UserInfoMenu from "./UserInfoMenu";
import Modal, { modalTypes } from "../Modals";
import styles from "./style.less";

const Header: React.FC<{ userToken: string | null }> = (props) => {
  let avatarUrl =
    (localStorage.getItem("avatarUrl") as string) ||
    "https://ftp.bmp.ovh/imgs/2021/06/d3edeccdd9ffeedb.png";
  const logoUrl = "https://z3.ax1x.com/2021/05/26/296wEd.png";

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<modalTypes>("Login");

  const showModal = () => {
    setModalVisible(true);
  };
  const hideModal = () => {
    setModalVisible(false);
  };
  const typeChange = (type: modalTypes) => {
    setModalType(type);
  };
  const userInfoMenu = UserInfoMenu({ userToken: props.userToken });
  return (
    <Row id={styles.header}>
      {/* 左侧 */}
      <Col flex="auto">
        <Row className={styles.headerLeft}>
          <Link className={styles.headerLink} to="/home">
            <span>首页</span>
          </Link>
          <Link className={styles.headerLink} to="/community">
            <span>社区</span>
          </Link>
          <Link className={styles.headerLink} to="/collections">
            <span>图集</span>
          </Link>
        </Row>
      </Col>
      {/* Logo */}
      <Col flex="auto">
        <Link className={styles.logo} to="/">
          {logoUrl ? <img src={logoUrl} alt="LOGO" /> : <span>LOGO</span>}
          <span>&emsp;星美集</span>
        </Link>
      </Col>
      {/* 右侧 */}
      <Col flex="auto">
        <Row className={styles.headerRight}>
          <Link className={styles.headerLink} to="/posting">
            发布文章
          </Link>
          <Link className={styles.headerLink} to="/upload">
            上传作品
          </Link>

          {props.userToken ? (
            <div className={styles.login}>
              <Dropdown overlay={userInfoMenu} trigger={["click"]} placement="bottomRight" arrow>
                <img src={avatarUrl} alt="头像" />
              </Dropdown>
            </div>
          ) : (
            <div className={styles.headerLink} onClick={showModal}>
              登录
            </div>
          )}
          <Modal
            visible={modalVisible}
            type={modalType}
            onCancel={hideModal}
            typeChange={typeChange}></Modal>
        </Row>
      </Col>
    </Row>
  );
};

export default connect((state: stateType) => ({ userToken: state.userToken }))(Header);
