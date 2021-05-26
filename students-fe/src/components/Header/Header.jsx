import React, { Component } from "react";
import "./Header.css";

class Header extends Component {
	state = {
		avatarUrl: "https://z3.ax1x.com/2021/05/26/29wTmR.jpg",
		logoUrl: "https://z3.ax1x.com/2021/05/26/296wEd.png",
	};
	render() {
		const { avatarUrl, logoUrl } = this.state;
		return (
			<div id="header" className="row">
				{/* logo */}
				<div className="logo">
					{logoUrl ? <img src={logoUrl} alt="头像" /> : <span>星美集</span>}
				</div>
				{/* 左侧 */}
				<div className="col-3 header-left">
					<div className="header-link">
						<span>首页</span>
					</div>
					<div className="header-link">
						<span>社区</span>
					</div>
					<div className="header-link">
						<span>图集</span>
					</div>
				</div>
				{/* 中间站位 */}
				<div className="col"></div>
				<div className="col-4 header-right">
					<div className="header-link">发布文章</div>
					<div className="header-link">上传作品</div>
					<div className="header-link login">
						{avatarUrl ? <img src={avatarUrl} alt="头像" /> : <span>登录</span>}
					</div>
				</div>
			</div>
		);
	}
}

export default Header;
