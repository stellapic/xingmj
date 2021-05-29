import React from "react";
import { Link } from "react-router-dom";
import { Row, Col } from "antd";
import styles from "./style.less";

const Header: React.FC<{}> = () => {
  const avatarUrl = "https://z3.ax1x.com/2021/05/26/29wTmR.jpg";
  const logoUrl = "https://z3.ax1x.com/2021/05/26/296wEd.png";

  return (
    <Row id={styles.header}>
      {/* logo */}
      <Col>
        <Link className={styles.logo} to="/">
          {logoUrl ? <img src={logoUrl} alt="头像" /> : <span>LOGO</span>}
          <span>&emsp;星美集</span>
        </Link>
      </Col>

      {/* 左侧 */}
      <Col span={5}>
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
      {/* 中间站位 */}
      <Col flex="auto"></Col>
      <Col span={7}>
        <Row className={styles.headerRight}>
          <Link className={styles.headerLink} to="/posting">
            发布文章
          </Link>
          <Link className={styles.headerLink} to="/upload">
            上传作品
          </Link>
          <Link className={`${styles.login}`} to="/login">
            {avatarUrl ? <img src={avatarUrl} alt="头像" /> : <span>登录</span>}
          </Link>
        </Row>
      </Col>
    </Row>
  );
};

export default Header;
