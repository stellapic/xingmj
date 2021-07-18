import React, { useEffect } from "react";
import { Row, Col, Menu, Button } from "antd";
import { apiGetUserInfo } from "../../request/api";
import styles from "./style.less";

export type userDataProps = {
  avatar: string;
  userName: string;
  email: string;
  intro: string;
  followCount: number;
  fansCount: number;
  thumbsCount: number;
};

const UserInfoMenu = (props: { userToken: string | null }) => {
  const userInfoData: userDataProps = {
    avatar: "https://ftp.bmp.ovh/imgs/2021/06/d3edeccdd9ffeedb.png",
    userName: "Marston",
    email: "879560215@qq.com",
    intro: "这个人很懒什么都没有留下",
    followCount: 0,
    fansCount: 0,
    thumbsCount: 0,
  };
  useEffect(() => {
    console.log(props.userToken);

    if (props.userToken) {
      apiGetUserInfo().then((data) => {
        console.log(data);

        try {
          userInfoData.avatar =
            data.data.avatar || "https://ftp.bmp.ovh/imgs/2021/06/d3edeccdd9ffeedb.png";
          userInfoData.userName = data.data.username || "Marston";
          userInfoData.email = data.data.email || "879560215@qq.com";
          userInfoData.intro = data.data.intro || "Just Do It!";
          userInfoData.followCount = data.data.follow_count || 0;
          userInfoData.fansCount = data.data.fans_count || 0;
          userInfoData.thumbsCount = data.data.thumbs_count || 0;
        } catch (e) {}
      });
    }
  });

  return (
    <Menu style={{ width: "240px", padding: "10px 15px" }}>
      <Menu.Item key="0" className={styles.myMenuItem}>
        <Row gutter={[0, 10]} justify="space-between">
          <Col span={24} style={{ textAlign: "center" }}>
            <img
              style={{ height: "80px", borderRadius: "50%" }}
              src={userInfoData.avatar}
              alt="头像"
            />
          </Col>
          <Col span={24}>
            <Button type="link" block style={{fontSize: "20px", fontWeight: 600}}>{userInfoData.userName}</Button>
          </Col>
          <Col span={24} style={{ textAlign: "center" }}>
            {userInfoData.email}
          </Col>
          <Col span={24}>
            <Row
              style={{
                borderTop: "1px solid #ddd",
                borderBottom: "1px solid #ddd",
                padding: "5px 0px",
              }}>
              <Col style={{ textAlign: "center" }} span={8}>
                <div className={styles.personalCardBtn}>粉丝</div>
                <div style={{ fontSize: "12px" }}>{userInfoData.fansCount}</div>
              </Col>
              <Col style={{ textAlign: "center", cursor: "pointer" }} span={8}>
                <div className={styles.personalCardBtn}> 关注</div>
                <div style={{ fontSize: "12px" }}>{userInfoData.followCount}</div>
              </Col>
              <Col style={{ textAlign: "center", cursor: "pointer" }} span={8}>
                <div className={styles.personalCardBtn}>被赞</div>
                <div style={{ fontSize: "12px" }}>{userInfoData.thumbsCount}</div>
              </Col>
            </Row>
          </Col>
          <Col span={24} style={{ whiteSpace: "normal", fontSize: "12px" }}>
            <div style={{ textAlign: "center", fontWeight: 600 }}>个人简介</div>
            {userInfoData.intro}
          </Col>
          <Col flex="1 1 auto">
            <Button type="primary" danger ghost block>
              退出登录
            </Button>
          </Col>
          {/* <Col span={4} style={{ textAlign: "center" }}>
            <Button type="text" danger ghost icon={ <LogoutOutlined /> }></Button>
          </Col> */}
        </Row>
      </Menu.Item>
    </Menu>
  );
};
export default UserInfoMenu;
