import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { stateType } from "../../redux/store";
import { NavLink, withRouter, RouteComponentProps } from "react-router-dom";
import { Row, Col, Dropdown } from "antd";
import UserInfoMenu from "./UserInfoMenu";
import Modal, { modalTypes } from "../Modals";
import styles from "./style.less";

type HeaderProps = {
  userToken: string | null
}

let Header: React.FC<HeaderProps & RouteComponentProps> = (props) => {
  const {userToken, history} = props;

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
  const userInfoMenu = UserInfoMenu({ userToken });

  // 获取当前页面路径的第一级路径，用来判断选中哪个link
  const rootPath = history.location.pathname.split('/')[1];

  return (
    <Row id={styles.header}>
      {/* 左侧 */}
      <Col flex="auto">
        <Row className={styles.headerLeft}>
          <NavLink className={styles.headerLink + ' ' + (rootPath == 'home'? styles.headerLinkActive : '')} to="/home">
            <span>首页</span>
          </NavLink>
          <NavLink className={styles.headerLink + ' ' + (rootPath == 'community'? styles.headerLinkActive : '')} to="/community">
            <span>社区</span>
          </NavLink>
          <NavLink className={styles.headerLink + ' ' + (rootPath == 'collections'? styles.headerLinkActive : '')} to="/collections">
            <span>图集</span>
          </NavLink>
        </Row>
      </Col>
      {/* Logo */}
      <Col flex="auto">
        <NavLink className={styles.logo} to="/">
          {logoUrl ? <img src={logoUrl} alt="LOGO" /> : <span>LOGO</span>}
          <span>&emsp;星美集</span>
        </NavLink>
      </Col>
      {/* 右侧 */}
      <Col flex="auto">
        <Row className={styles.headerRight}>
          <NavLink className={styles.headerLink} to="/posting">
            发布文章
          </NavLink>
          <NavLink className={styles.headerLink} to="/upload">
            上传作品
          </NavLink>

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

export default withRouter(connect((state: stateType) => ({ userToken: state.userToken }))(Header));
