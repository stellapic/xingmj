import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header: React.FC<{}> = () => {
	const	avatarUrl = "https://z3.ax1x.com/2021/05/26/29wTmR.jpg";
	const	logoUrl = "https://z3.ax1x.com/2021/05/26/296wEd.png";

	return (
		<div id="header" className="row">
			{/* logo */}
			<Link className="logo" to="/">
				{logoUrl ? <img src={logoUrl} alt="头像" /> : <span>LOGO</span>}
				<span>&emsp;星美集</span>
			</Link>
			{/* 左侧 */}
			<div className="col-3 header-left">
				<Link className="header-link" to="/home">
					<span>首页</span>
				</Link>
				<Link className="header-link" to="/community">
					<span>社区</span>
				</Link>
				<Link className="header-link" to="/collections">
					<span>图集</span>
				</Link>
			</div>
			{/* 中间站位 */}
			<div className="col"></div>
			<div className="col-4 header-right">
				<Link className="header-link" to="/posting">
					发布文章
				</Link>
				<Link className="header-link" to="/upload">
					上传作品
				</Link>
				<Link className="header-link login" to="/login">
					{avatarUrl ? <img src={avatarUrl} alt="头像" /> : <span>登录</span>}
				</Link>
			</div>
		</div>
	);
}

export default Header;
