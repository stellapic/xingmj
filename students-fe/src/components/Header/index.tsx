import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { stateType } from "../../redux/store";
import { NavLink, withRouter, RouteComponentProps } from "react-router-dom";
import { Row, Col, Dropdown, Drawer, Menu } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import UserInfoMenu from "./UserInfoMenu";
import Modal, { modalTypes } from "../Modals";
import styles from "./style.less";

type HeaderProps = {
  userToken: string | null
}

let Header: React.FC<HeaderProps & RouteComponentProps> = (props) => {
  const { userToken, history } = props;
  const logoUrl = "https://z3.ax1x.com/2021/05/26/296wEd.png";
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<modalTypes>("Login");
  const [drawerVisible, setDrawerVisible] = useState(false);
  let avatarUrl =
    (localStorage.getItem("avatarUrl") as string) ||
    "https://ftp.bmp.ovh/imgs/2021/06/d3edeccdd9ffeedb.png";
  
  const showModal = () => {
    setModalVisible(true);
  };
  const hideModal = () => {
    setModalVisible(false);
  };
  const showDrawer = () => {
    setDrawerVisible(true);
  };
  const hideDrawer = () => {
    setDrawerVisible(false);
  }
  const typeChange = (type: modalTypes) => {
    setModalType(type);
  };
  const clickMenuItem = (params: any) => {
    setDrawerVisible(false);
    history.push(`/${params.key}`)
    console.log(props);
  }

  const UserBtn: React.FC<HeaderProps> = (props) => {
    return props.userToken ? (
      <div className={styles.login}>
        <Dropdown overlay={userInfoMenu} trigger={["click"]} placement="bottomRight" arrow>
          <img src={avatarUrl} alt="头像" />
        </Dropdown>
      </div>
    ) : (
      <div className={styles.headerLink} onClick={showModal}>
        登录
      </div>
    )
  }

  const userInfoMenu = UserInfoMenu({ userToken });

  // 获取当前页面路径的第一级路径，用来判断选中哪个link
  const rootPath = history.location.pathname.split('/')[1];

  return (
    <>
      <Row id={styles.header} align="middle" justify="space-between">
        {/* PC端 */}
        {/* 左侧 */}
        <Col flex="auto" xs={0} sm={12} style={{marginLeft: "50px"}}>
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
        {/* 右侧 */}
        <Col flex="auto" xs={0} sm={12} style={{marginRight: "50px"}}>
          <Row className={styles.headerRight}>
            <NavLink className={styles.headerLink} to="/posting">
              发布文章
            </NavLink>
            <NavLink className={styles.headerLink} to="/upload">
              上传作品
            </NavLink>
            <UserBtn userToken={props.userToken}></UserBtn>
            <Modal
              visible={modalVisible}
              type={modalType}
              onCancel={hideModal}
              typeChange={typeChange}></Modal>
          </Row>
        </Col>

        {/* 移动端 */}
        <Col sm={0} style={{ marginLeft: "24px", color: "#fff" }}>
          <MenuOutlined onClick={showDrawer} />
          <Drawer visible={drawerVisible} onClose={hideDrawer} placement="left" bodyStyle={{padding: "0"}} closable={false} title="菜单" destroyOnClose={true}>
            <Menu onClick={clickMenuItem}>
              <Menu.Item key="home">首页</Menu.Item>
              <Menu.Item key="community">社区</Menu.Item>
              <Menu.Item key="collections">图集</Menu.Item>
              <Menu.Item key="posting">发布文章</Menu.Item>
              <Menu.Item key="upload">上传作品</Menu.Item>
            </Menu>
          </Drawer>
        </Col>
        {/* Logo */}
        <Col sm={0}>
          <NavLink className={styles.logo} to="/">
            {logoUrl ? <img src={logoUrl} alt="LOGO" /> : <span>LOGO</span>}
            <span>&emsp;星美集</span>
          </NavLink>
        </Col>
        <Col sm={0} style={{marginRight: "24px"}}>
          <UserBtn userToken={props.userToken}></UserBtn>
        </Col>
      </Row>
    </>
  );
};

export default withRouter(connect((state: stateType) => ({ userToken: state.userToken }))(Header));
